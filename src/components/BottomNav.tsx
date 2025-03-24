import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-screen-sm">
            <div className="btm-nav">
                {/* Search */}
                <button className="bg-amber-50 text-teal-600">
                    <Link to="/" className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                        </svg>
                    </Link>
                </button>

                {/* Home */}
                <button className="bg-blue-200 text-blue-600">
                    <Link to="/" className="flex flex-col items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span className="btm-nav-label"></span>
                    </Link>
                </button>
            </div>
        </div>
    )
}

export default Navbar
