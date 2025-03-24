import {Location, useLocation} from "react-router-dom";
import React from "react";

const Home= () => {
    const location: Location = useLocation(); // 타입 명시

    // pathname에 따라 상태를 매핑
    const renderHeader = (): React.JSX.Element => {
        switch (location.pathname) {
            case "/":
                return <header className="text-lg font-bold text-center mb-4">최근 업로드한 파일</header>;
            default:
                return (
                    <header className="breadcrumbs text-sm text-center mb-4">
                        <ul>
                            <li><a>Home</a></li>
                            <li><a>Documents</a></li>
                            <li>Add Document</li>
                        </ul>
                    </header>
                );
        }
    };

    return (
        <div>
            {renderHeader()}
            <div className="flex flex-col overflow-y-auto h-screen gap-y-2">
                <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <svg
                           ...
                        </svg>

                        {/* 파일명과 업로드 날짜 */}
                        <div>
                            <h3 className="font-medium">파일명.PDF</h3>
                            <p className="text-sm text-gray-500">2000.01.01</p>
                        </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex space-x-2">
                        {/* 다운로드 버튼 */}
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg
                       ...
                            </svg>
                        </button>

                        {/* 수정 버튼 */}
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg
                            ...
                            </svg>
                        </button>

                        {/* 상세정보 버튼 */}
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <svg
                                ...
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
