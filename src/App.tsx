import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ApodData {
  url: string;
  title: string;
  explanation: string;
}

interface MarsPhoto {
  img_src: string;
  rover: {
    name: string;
  };
}

const App: React.FC = () => {
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [marsPhotos, setMarsPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apodDate, setApodDate] = useState<string>(''); // Date for APOD
  const [marsDate, setMarsDate] = useState<string>(''); // Date for Mars photos

  const apiKey = "Qdh9mrL4H50euTvpk079nT3sOK04F8JDbClbTCAI";

  const fetchApod = async (date: string = '') => {
    try {
      setLoading(true);
      const response = await axios.get<ApodData>(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}${date ? `&date=${date}` : ''}`
      );
      setApodData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarsPhotos = async (date: string = '', rover: string = 'curiosity') => {
    try {
      setLoading(true);
      const response = await axios.get<{ photos: MarsPhoto[] }>(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${apiKey}`
      );
      setMarsPhotos(response.data.photos);
    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApod(); 
  }, []);

  const handleApodDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApodDate(e.target.value);
  };

  const handleMarsDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMarsDate(e.target.value);
  };

  const handleApodSubmit = () => {
    fetchApod(apodDate);
  };

  const handleMarsSubmit = () => {
    fetchMarsPhotos(marsDate);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>NASA API Example with Date Selection</h1>

      {/* Date Selection for Astronomy Picture of the Day */}
      <div>
        <h2>Select a Date for Astronomy Picture of the Day (APOD)</h2>
        <input
          type="date"
          value={apodDate}
          onChange={handleApodDateChange}
        />
        <button onClick={handleApodSubmit}>Fetch APOD</button>
      </div>

      {/* Display Astronomy Picture of the Day */}
      {apodData && (
        <div>
          <h3>{apodData.title}</h3>
          <img src={apodData.url} alt={apodData.title} style={{ maxWidth: '100%' }} />
          <p>{apodData.explanation}</p>
        </div>
      )}

      {/* Date Selection for Mars Rover Photos */}
      <div>
        <h2>Select a Date for Mars Rover Photos</h2>
        <input
          type="date"
          value={marsDate}
          onChange={handleMarsDateChange}
        />
        <button onClick={handleMarsSubmit}>Fetch Mars Rover Photos</button>
      </div>

      {/* Display Mars Rover Photos */}
      <div>
        <h2>Mars Rover Photos</h2>
        {marsPhotos.length > 0 ? (
          <div>
            {marsPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo.img_src}
                alt={`Mars Rover - ${photo.rover.name}`}
                style={{ width: '200px', margin: '10px' }}
              />
            ))}
          </div>
        ) : (
          <p>No photos available for the selected date</p>
        )}
      </div>
    </div>
  );
};

export default App;
