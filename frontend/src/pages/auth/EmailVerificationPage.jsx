import React from 'react';
import {Link, useParams} from "react-router-dom";
import Spinner from "../../components/Spinner";
import success from "../../assets/images/success.png"

import {useVerifyEmailQuery} from "../../slices/userApiSlice"

const EmailVerificationPage = () => {
    const {id: token} = useParams();


    const {
        data,
        isLoading,
        error
    } = useVerifyEmailQuery(token)

    const msg = data?.message


    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 mx-36">
            {isLoading ? (
                <Spinner/>
            ) : error ? (
                <div className='flex flex-col items-center gap-4'>
                    <p className="text-center text-xl text-red-600">
                        OOPS!!! Une erreur s'est produite, renouveler la demande de vérification de votre e-mail en cliquant sur le bouton ci-dessous. 
                    </p>
                    <Link to={`/resend/verification/${token}`} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-white  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Renouveller la vérification</Link>
                </div>
            ) : (
                <div className="text-center">
                    <div className="my-10 flex items-center justify-center gap-x-6">
                        <img src={success} alt="SuccessImg"  className='h-28 w-28'/>
                    </div>
                    <h2 className="my-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{msg}!</h2>
                    <Link to="/login" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full">Login</Link>
                </div>
            )}
        </main>
    )
}

export default EmailVerificationPage