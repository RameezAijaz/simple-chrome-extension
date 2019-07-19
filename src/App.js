import 'jquery/dist/jquery.min';
import 'bootstrap/dist/js/bootstrap.min';
import './assets/css/style.css';
import ReactDOM from 'react-dom';
import React from 'react';
import TodoList from './TodoList';

function App() {
    return(<TodoList/>)
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
