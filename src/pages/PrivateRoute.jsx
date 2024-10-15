import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    useEffect(() => {
        const checkToken = async () => {
            if (!accessToken) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        query: `
                        query {
                            info {
                                id
                                username
                            }
                        }`
                    }),
                });

                const result = await response.json();

                // Nếu có lỗi xác thực, xóa token và chuyển hướng về trang đăng nhập
                if (result.errors) {
                    localStorage.removeItem('access_token');
                    navigate('/');
                }
            } catch (error) {
                localStorage.removeItem('access_token');
                navigate('/');
            }
        };

        checkToken();
    }, [accessToken, navigate]);

    return accessToken ? children : null;
};

export default PrivateRoute;
