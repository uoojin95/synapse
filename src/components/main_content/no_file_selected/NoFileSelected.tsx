import React, { useState } from 'react';
import './no-file-selected.css';

const Template = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleNewFile = () => {
    setIsEditing(true);
    // Here you would typically handle file creation logic 
    // (e.g., create a new file in the user's file system or in a database)
  };

  return (
    <div className="template-container">
      <h1 className="template-title">Welcome to Your Notetaker</h1>
      <p className="template-message">Create a new file to start taking notes.</p>
      <button className="new-file-button" onClick={handleNewFile}>Create New File</button>
    </div>
  );
};

export default Template;


