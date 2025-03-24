const downloadFile = async (downloadLink: string, fileName: string) => {
    try {
        const accessToken = localStorage.getItem('accessToken'); // localStorage 에서 Access Token 가져오기
        const response = await fetch(downloadLink, { // 다운로드 링크 전체 URL 사용
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 인증 헤더 추가!
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP 에러! 상태 코드: ${response.status}`);
        }

        const blob = await response.blob(); // 응답을 Blob 형태로 받기 (파일 다운로드에 중요!)
        const url = window.URL.createObjectURL(blob); // Blob URL 생성
        const a = document.createElement('a'); // 임시 <a> 태그 생성
        a.href = url;
        a.download = fileName; // 다운로드 파일 이름 설정 (브라우저가 이 이름으로 파일 저장하도록 제안)
        document.body.appendChild(a); // <a> 태그를 DOM 에 추가
        a.click(); // 프로그래밍적으로 클릭! 다운로드 시작!
        a.remove(); // <a> 태그 다시 제거
        window.URL.revokeObjectURL(url); // Blob URL 해제 (메모리 누수 방지)
    } catch (error) {
        console.error('다운로드 실패:', error);
    }
};

export default downloadFile;