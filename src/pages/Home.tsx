import React, {useRef, useState} from 'react';
import { Location, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch'

import { ArrowDownTrayIcon, DocumentIcon, InformationCircleIcon, PencilSquareIcon, LinkIcon, ShareIcon } from "@heroicons/react/24/outline";
import downloadFile from "../utils/downloadFile.ts";
import {PlusIcon} from "@heroicons/react/16/solid";
import {ContentType, useMutation} from "../hooks/useMutation.ts";

interface StorageFile {
    id: string;
    name: string;
    createdTime: string;
    lastModifiedTime: string;
    fileSize: string;
    downloadLink: string;
    isSharing: boolean;
}

interface ToggleSharingResponse {
    shareLink: string;
    toggleResult: boolean;
}

interface StorageFileResponse {
    storageId: string;
    storageFiles: StorageFile[];
}

const Home = () => {
    const location: Location = useLocation();
    const { data, loading, error, reload, API_BASE_URL } = useFetch<StorageFileResponse>('/storages/me/files');
    const storageFiles = data?.storageFiles;
    const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});

    const storageId = data?.storageId;

    const { mutate: uploadFileMutation, loading: uploadLoading, error: uploadError} = useMutation<FormData>();
    const { mutate: toggleSharingMutation } = useMutation<never, ToggleSharingResponse>();
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileUploadButtonClick = () => {
        console.log('Button clicked!');
        fileInputRef.current?.click();
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !storageId) {
            return;
        }

        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadFileMutation(`/storages/${storageId}/files`, 'POST', formData, ContentType.MultipartFormData);
            reload();
            // TODO: 업로드 성공 알림 (Toast, Snackbar 등)
        } catch (error: any) {
            // TODO: 업로드 실패 알림 (Toast, Snackbar 등) or error state UI 업데이트
            console.error("File upload failed:", uploadError || error);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleToggleSharing = async (fileId: string) => {
        try {
            const toggleSharingData = await toggleSharingMutation(`/files/${fileId}/toggle-sharing`, 'PATCH');
            // toggleResult가 true일 때만 링크 복사 및 복사 상태 업데이트
            if (toggleSharingData?.toggleResult) {
                // 응답에서 shareLink 중 '/files'를 제거하고 도메인 추가
                const cleanShareLink = `filejy.kr${toggleSharingData.shareLink.replace('/files', '')}`;

                await navigator.clipboard.writeText(cleanShareLink);

                setCopyStatus(prev => ({ ...prev, [fileId]: true }));

                // 2초 후 복사 상태 초기화
                setTimeout(() => {
                    setCopyStatus(prev => ({ ...prev, [fileId]: false }));
                }, 2000);
            }
            reload();
        } catch (error) {
            console.error("Toggle sharing failed:", error);
        }
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
                    <p className="text-gray-500 mb-4">파일이 없습니다.</p>
                    <p className="text-gray-400 text-sm">아래 + 버튼을 눌러 파일을 업로드해보세요.</p>
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
                                {/* 공유 토글 버튼 */}
                                <button
                                    className={`p-2 rounded-full ${file.isSharing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-800'}`}
                                    onClick={() => handleToggleSharing(file.id)}
                                    title={file.isSharing ? "공유 중지" : "공유 시작"}
                                >
                                    {copyStatus[file.id] ? (
                                        <div className="text-xs font-medium">복사됨!</div>
                                    ) : (
                                        file.isSharing ? (
                                            <LinkIcon className="w-5 h-5" />
                                        ) : (
                                            <ShareIcon className="w-5 h-5" />
                                        )
                                    )}
                                </button>

                                {/* 다운로드 */}
                                <button className="p-2 hover:bg-gray-100 rounded-full"
                                        onClick={() => downloadFile(`${API_BASE_URL}${file.downloadLink}`, file.name)}>
                                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-800">
                                    </ArrowDownTrayIcon>
                                </button>

                                {/* 수정 버튼 (일단 기능 빼고 UI만) */}
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <PencilSquareIcon className="w-5 h-5 text-gray-800">
                                    </PencilSquareIcon>
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

            {/* 숨겨진 파일 input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
            />

            {/* 파일 업로드 Floating Button */}
            <button className="absolute bottom-36 right-5 btn btn-primary btn-circle"
                    onClick={handleFileUploadButtonClick}
                    disabled={uploadLoading}
            >
                <PlusIcon className="h-6 w-6 text-white"/>
            </button>

            {uploadLoading && <div>Uploading...</div>}
            {uploadError && <div>Upload Error: {uploadError}</div>}
        </div>
    );
};

export default Home;
