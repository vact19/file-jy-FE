import React, {useRef} from 'react';
import { Location, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch'

import { ArrowDownTrayIcon, DocumentIcon, InformationCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
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
}

interface StorageFileResponse {
    storageId: string;
    storageFiles: StorageFile[];
}

const Home = () => {
    const location: Location = useLocation();
    const { data, loading, error, reload, API_BASE_URL } = useFetch<StorageFileResponse>('/storages/me/files');
    const storageFiles = data?.storageFiles;

    const storageId = data?.storageId;

    const { mutate: uploadFileMutation, loading: uploadLoading, error: uploadError} = useMutation();
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

    if (loading) {
        return <div>Loading...</div>; // 아니면 예쁜 로딩 스피너 컴포넌트 넣어도 좋고!
    }

    if (error) {
        return <div>Error: {error}</div>; // 사용자에게 친절하게 에러 메시지 보여주기!
    }

    if (!storageFiles || storageFiles?.length === 0) {
        return <div>No files found.</div>; // 파일 없을 때 "파일이 없습니다" 같은 메시지 보여주기!
    }

    return (
        <div>
            {renderHeader()}
            <div className="flex flex-col overflow-y-auto h-screen gap-y-2">
                {/* ✨ 파일 목록 렌더링! */}
                {storageFiles?.map((file: StorageFile) => (
                    <div key={file.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <DocumentIcon className="w-8 h-8 text-gray-800">
                            </DocumentIcon>

                            {/* 파일명과 업로드 날짜 */}
                            <div>
                                <h3 className="font-medium">{file.name}</h3>
                                <p className="text-sm text-gray-500">{new Date(file.createdTime).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="flex space-x-2">
                            {/* 다운로드 */}
                            <button className="p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => downloadFile(`${API_BASE_URL}${file.downloadLink}`, file.name)}>
                                <ArrowDownTrayIcon className="w-5 h-5 ktext-gray-800">
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

            {/* 숨겨진 파일 input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
            />

            {/* 파일 업로드 Floating Button */}
            <button className="absolute bottom-24 right-5 btn btn-primary btn-circle"
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