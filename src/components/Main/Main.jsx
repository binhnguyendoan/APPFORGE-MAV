import React from 'react';

const Main = () => {
    return (
        <div className='p-5 sm:p-11'>
            <div className='flex justify-between'>
                <div className='text-[16px] sm:text-[20px]'>
                    <div className='flex justify-between '>
                        <h2>Income </h2>
                        <p className='ml-5 text-[#54ccb5]'> $ 2,900</p>
                    </div>
                    <div className='flex justify-between mt-5'>
                        <h2>Blance </h2>
                        <p className='ml-5 text-[#b1b1b1]'> $ 1,510</p>
                    </div>

                </div>
                <div className='flex justify-between text-[16px] sm:text-[20px]'>
                    <h2>Expence </h2>
                    <p className='ml-5 text-[#f18189]'> $ 1,131</p>
                </div>
            </div>
        </div>
    );
}

export default Main;
