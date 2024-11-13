import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(event) {
        event.preventDefault();

        if (formData.password.length < 6) {
            setMessage('Password must contain at least 6 characters');
            setIsError(true);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 50000);
            return;
        }

        const query = `
            mutation {
                register(username: "${formData.username}", email: "${formData.email}", password: "${formData.password}") {
                    message
                }
            }
        `

        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            if (result.errors) {
                console.error("GraphQL Error:", result.errors);
                setMessage('Registration failed!');
                setIsError(true);
            } else {
                const successMessage = result.data.register.message;
                setMessage(successMessage || 'Registration successful!');
                setIsError(false);
            }
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
                navigate('/');
            }, 5000);


        } catch (error) {
            console.error("Error:", error);
            setMessage('Registration failed!');
            setIsError(true);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 1000);
        }
    }
    const handleLoginClick = () => {
        navigate('/');
    };


    return (
        // <form onSubmit={handleSubmit}>
        //     <input
        //         type="text"
        //         name="username"
        //         placeholder="Username"
        //         value={formData.username}
        //         onChange={handleChange}
        //         required
        //     />
        // <input
        //     type="email"
        //     name="email"
        //     placeholder="Email"
        //     value={formData.email}
        //     onChange={handleChange}
        //     required
        // />
        //     <input
        //         type="password"
        //         name="password"
        //         placeholder="Password"
        //         value={formData.password}
        //         onChange={handleChange}
        //         required
        //     />
        //     <button type="submit">Register</button>
        //     {message && (
        //         <p style={{ color: isError ? 'red' : 'green' }}>
        //             {message}
        //         </p>
        //     )}
        // </form>
        <div className='flex w-full h-screen'>
            <div className='w-full flex items-center justify-center lg:w-1/2'>
                <form onSubmit={handleSubmit} className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 '>
                    <h1 className='text-5xl font-semibold text-center w-full'>Sign Up</h1>
                    <div className='mt-8'>
                        <div>
                            <label className='text-lg font-medium'>Name</label>
                            <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' type="text" placeholder='Enter your name'
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required />
                        </div>
                        <div>
                            <label className='text-lg font-medium'>Email</label>
                            <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' type="email" placeholder='Enter your email'
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required />
                        </div>
                        <div>
                            <label className='text-lg font-medium'>Password</label>
                            <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' type="password" placeholder='Enter your password'
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required />
                        </div>
                        <div className='mt-8 flex justify-between items-center'>
                            <div>
                                <input type="checkbox" id='remember' />
                                <label htmlFor='remember' className='ml-2 font-medium test-base'>Remember</label>
                            </div>
                            <button className='font-medium text-base text-violet-500'>Forgot password</button>
                        </div>
                        <div className='mt-8 flex flex-col gap-y-4 '>
                            <button type="submit" className='active:scale-[.98] active:duration-75 ease-in-out hover:scale-[1.01] transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'>Sign up</button>
                            <button type='button' onClick={handleLoginClick} className='active:scale-[.98] active:duration-75 ease-in-out hover:scale-[1.01] transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold'>Login</button>
                        </div>

                    </div>
                </form>
            </div>
            <div className='hidden relative bg-gray-200 h-full items-center w-1/2 justify-center lg:flex'>
                <div className='w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce'></div>
                <div className='w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg '></div>
            </div>

            {showMessage && (
                <div className={`fixed top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                    {message}
                </div>
            )}

        </div>

    );
};

export default Register;
