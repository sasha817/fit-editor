export function DownloadJSON({ data, fileName }: { data: any; fileName: string }) {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Export Data
    </button>
  );
}
