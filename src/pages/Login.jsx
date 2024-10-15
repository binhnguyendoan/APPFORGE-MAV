import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const query = `
            mutation {
                login(email: "${email}", password: "${password}") {
                    access_token
                    token_type
                    expires_in
                }
            }
        `;

        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();

            if (result.errors) {
                setErrorMessage('Email or password is incorrect.');
            } else {
                const { access_token } = result.data.login;
                localStorage.setItem('access_token', access_token);
                const userInfoQuery = `
                query {
                    info {
                        id
                        username
                        email
                    }
                }
            `;
                const userInfoResponse = await fetch("https://appforge.mavsolutions.vn/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`,
                    },
                    body: JSON.stringify({ query: userInfoQuery }),
                });
                const userInfoResult = await userInfoResponse.json();
                const { id, username } = userInfoResult.data.info;
                localStorage.setItem('user_id', id);
                localStorage.setItem('user_name', username);
                navigate('/dashboard');
            }
        } catch (error) {
            setErrorMessage('An error occurred while logging in.');
            console.error(error);
        }
    };
    const handleRegisterClick = () => {
        navigate('/signup');
    };

    return (
        <div className='flex w-full h-screen'>
            <div className='w-full flex items-center justify-center lg:w-1/2'>
                <form onSubmit={handleSubmit} className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 '>
                    <h1 className='text-5xl font-semibold text-center w-full'>Login</h1>
                    <div className='mt-8'>
                        <div>
                            <label className='text-lg font-medium'>Email</label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                                type="email"
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className='text-lg font-medium'>Password</label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent'
                                type="password"
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && (
                            <div className="text-red-500 mt-4">
                                {errorMessage}
                            </div>
                        )}
                        <div className='mt-8 flex justify-between items-center'>
                            <div>
                                <input type="checkbox" id='remember' />
                                <label htmlFor='remember' className='ml-2 font-medium test-base'>Remember</label>
                            </div>
                            <button className='font-medium text-base text-violet-500'>Forgot password</button>
                        </div>
                        <div className='mt-8 flex flex-col gap-y-4 '>
                            <button
                                type="submit"
                                className='active:scale-[.98] active:duration-75 ease-in-out hover:scale-[1.01] transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'>
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={handleRegisterClick}
                                className='active:scale-[.98] active:duration-75 ease-in-out hover:scale-[1.01] transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'>
                                Register
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='hidden relative bg-gray-200 h-full items-center w-1/2 justify-center lg:flex'>
                <div className='w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce'></div>
                <div className='w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg '></div>
            </div>
        </div>
    );
};

export default Login;
