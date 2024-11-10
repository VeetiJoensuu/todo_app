import React from 'react';

function Row({ item, deleteTask }) {
    return (
        <li className="home-item">
            <span className="home-description">{item.description}</span>
            <button className="home-button" onClick={() => deleteTask(item.id)}>Delete</button>
        </li>
    );
}

export default Row;
