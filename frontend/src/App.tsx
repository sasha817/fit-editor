import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import { DownloadJSON } from './components/DownloadJSON';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervals, setIntervals] = useState<any[]>([]); // Replace `any` with your data type if needed
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedIntervals, setEditedIntervals] = useState<any[]>([]);

  const handleValidation = async () => {
     if (!selectedFile) {
      alert("Please select a FIT file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/validate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.valid && result.intervals) {
        setIntervals(result.intervals);
        setError(null);
      } else {
        setError(result.error || "No valid data found.");
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message);
    }
  };

  const handleEditor = () => {
    setIsEditMode(true);
    setEditedIntervals([...intervals]); // copy current data for editing
  };

  const handleSave = () => {
    setIsEditMode(false);
    setIntervals(editedIntervals); // commit edits
  };

return (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Header />

    <main style={{
      flex: 1,
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#333' }}>
        Upload your swimming activity file (.fit) to view and validate its intervals.
      </p>

      <FileUpload onFileSelected={setSelectedFile} />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        <button
          onClick={handleValidation}
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.7rem 1.2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Validate / View File'}
        </button>

        <button
          onClick={handleEditor}
          disabled={loading}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '0.7rem 1.2rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Editor
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '1.5rem',
          padding: '0.8rem',
          backgroundColor: '#fdecea',
          color: '#611a15',
          borderRadius: '5px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {intervals.length > 0 && (
        <div style={{
          marginTop: '2rem',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ccc'
          }}>
            <thead style={{ backgroundColor: '#004d99', color: 'white' }}>
              <tr>
                <th style={{ padding: '0.5rem' }}>#</th>
                <th style={{ padding: '0.5rem' }}>Type</th>
                <th style={{ padding: '0.5rem' }}>Length, m</th>
                <th style={{ padding: '0.5rem' }}>Elapsed time</th>
                <th style={{ padding: '0.5rem' }}>Pace (/100m)</th>
                <th style={{ padding: '0.5rem' }}>Strokes</th>
                <th style={{ padding: '0.5rem' }}>Swolf</th>
                <th style={{ padding: '0.5rem' }}>Stroke type</th>
              </tr>
            </thead>
            <tbody>
              {isEditMode
                ? editedIntervals.map((row, index) => (
                    <tr key={index}>
                      <td>{row.interval}</td>

                      {/* Interval type */}
                      <td>
                        <select
                          value={row.type || "swim"}
                          onChange={(e) => {
                            const newData = [...editedIntervals];
                            newData[index].type = e.target.value;
                            setEditedIntervals(newData);
                          }}
                        >
                          <option value="swim">Swim</option>
                          <option value="pause">Pause</option>
                        </select>
                      </td>

                      {/* Interval length (editable numeric value) */}
                      <td>
                        <input
                          type="number"
                          value={row.length ?? 25}
                          onChange={(e) => {
                            const newData = [...editedIntervals];
                            newData[index].length = parseInt(e.target.value);
                            setEditedIntervals(newData);
                          }}
                          style={{ width: '4rem', textAlign: 'center' }}
                        />
                      </td>

                      {/* Read-only pace, strokes, swolf */}
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.time_str}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.pace}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.strokes}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.swolf}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.swim_stroke}</td>
                    </tr>
                  ))
                : intervals.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.interval}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.type}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.length}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.time_str}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.pace}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.strokes}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.swolf}</td>
                      <td style={{ border: '1px solid #ccc', padding: '0.4rem' }}>{row.swim_stroke}</td>
                    </tr>
                  ))
              }
            </tbody>

          </table>
            <div style={{ marginTop: '1.5rem' }}>
              {!isEditMode ? (
                <button
                  onClick={handleEditor}
                  style={{
                    backgroundColor: '#ffc107',
                    color: 'black',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Go to Edit Mode
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              )}
              &nbsp;
              {!isEditMode && intervals.length > 0 && (
                <DownloadJSON data={intervals} fileName="updated_swim_activity" />
              )}
            </div>
        </div>
      )}
    </main>

    <Footer />
  </div>
);

};

export default App;
