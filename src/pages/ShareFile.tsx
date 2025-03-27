import React from 'react';
import {useParams} from 'react-router-dom';
import { useFetch } from '../hooks/useFetch'

import { ArrowDownTrayIcon, DocumentIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import downloadFile from "../utils/downloadFile.ts";

interface StorageFile {
    id: string;
    name: string;
    createdTime: string;
    lastModifiedTime: string;
    fileSize: string;
    downloadLink: string;
    isSharing: boolean;
}

interface StorageFileResponse {
    storageId: string;
    storageFiles: StorageFile[];
}

const ShareFile = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data, loading, error, API_BASE_URL } = useFetch<StorageFileResponse>(`/files/share/users/${userId}`);
    const storageFiles = data?.storageFiles;

    const renderHeader = (): React.JSX.Element => {
        return <header className="text-lg font-bold text-center mb-4">공유중인 파일</header>;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {renderHeader()}

            {(!storageFiles || storageFiles.length === 0) ? (
                // 파일이 없을 때 표시할 메시지
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-500 mb-4">공유한 파일이 없습니다.</p>
                </div>
            ) : (
                // 파일이 있을 때 파일 목록 표시
                <div className="flex flex-col overflow-y-auto h-screen gap-y-2">
                    {storageFiles.map((file: StorageFile) => (
                        <div key={file.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <DocumentIcon className="w-8 h-8 text-gray-800">
                                </DocumentIcon>

                                {/* 파일명, 업로드 날짜, 파일 크기 */}
                                <div>
                                    <h3 className="font-medium">{file.name}</h3>
                                    <div className="flex space-x-2 text-sm text-gray-500">
                                        <p>{new Date(file.createdTime).toLocaleDateString()}</p>
                                        <p>•</p>
                                        <p>{file.fileSize}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼들 */}
                            <div className="flex space-x-2">

                                {/* 다운로드 */}
                                <button className="p-2 hover:bg-gray-100 rounded-full"
                                        onClick={() => downloadFile(`${API_BASE_URL}${file.downloadLink}`, file.name)}>
                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-800">
                                    </ArrowDownTrayIcon>
                                </button>

                                {/* 상세정보 버튼 (일단 기능 빼고 UI만) */}
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <InformationCircleIcon className="w-5 h-5 text-gray-800">
                                    </InformationCircleIcon>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShareFile;