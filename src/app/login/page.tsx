import Link from "next/link";

export default function Login() {
    return (
        <>
            <div className="flex min-h-screen flex-col justify-center items-center ">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-600">
                        Acesse sua conta
                    </h2>
                </div>
                <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-xl shadow-[0_10px_15px__rgba(79,57,246,0.3)]">
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action="#" method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-500">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-500">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <label className="flex items-center text-sm text-gray-300">
                                    <input type="checkbox" className="mr-2 rounded border-gray-600 bg-[#0f172a]" />          
                                    Lembre de mim
                                </label>
                                <a href="#" className="text-sm text-indigo-600 hover:underline">
                                    Esqueceu a Senhra?
                                </a>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-gray-700 "></div>
                            <span className="px-3 text-gray-400 text-sm">
                                Acesse também com
                            </span>
                            <div className="flex-grow border-t border-gray-700 "></div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0f172a] border border-gray-700 rounded-md text-white hover:bg-gray-800">
                                <img
                                    src="https://www.svgrepo.com/show/355037/google.svg" 
                                    alt="google" 
                                    className="w-5 h-5" 
                                />
                                Google
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#0f172a] border border-gray-700 rounded-md text-white hover:bg-gray-800">
                                <img 
                                    src="https://www.svgrepo.com/show/349375/github.svg" 
                                    alt="github" 
                                    className="w-5 h-5"
                                />
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};