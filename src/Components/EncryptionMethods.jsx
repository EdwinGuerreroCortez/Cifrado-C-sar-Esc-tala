import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

function CopyIcon({ result, showNotification }) {
    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(result)
                .then(() => {
                    showNotification();
                })
                .catch(err => {
                    console.error("Error copiando al portapapeles: ", err);
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = result;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification();
            } catch (err) {
                console.error("Error copiando con execCommand: ", err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <button
            className="button is-small is-light"
            style={{
                width: '100px',
                visibility: result ? 'visible' : 'hidden'  
            }}
            onClick={handleCopy}
        >
            <FontAwesomeIcon icon={faCopy} /> Copiar
        </button>
    );
}


function Notification({ message, type, visible }) {
    return (
        <div
            className={`notification ${type}`}
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: visible ? 'block' : 'none',
                zIndex: 1000, 
                width: '200px',
            }}
        >
            {message}
        </div>
    );
}

function CaesarCipher() {
    const [message, setMessage] = useState('');
    const [shift, setShift] = useState(0);
    const [result, setResult] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    const handleEncrypt = () => {
        const encrypted = message
            .split('')
            .map(char => String.fromCharCode((char.charCodeAt(0) + parseInt(shift) - 65) % 26 + 65))
            .join('');
        setResult(encrypted);
    };

    const handleDecrypt = () => {
        const decrypted = message
            .split('')
            .map(char => String.fromCharCode((char.charCodeAt(0) - parseInt(shift) - 65 + 26) % 26 + 65))
            .join('');
        setResult(decrypted);
    };

    const showNotification = () => {
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 1000); 
    };

    return (
        <div className="box" style={{ position: 'relative' }}>
            <h2 className="title is-4">Cifrado César</h2>

            <div className={`dropdown ${isGuideVisible ? 'is-active' : ''} is-right is-hoverable`}>
                <div className="dropdown-trigger">
                    <button
                        className="button"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                        onClick={() => setIsGuideVisible(!isGuideVisible)}
                    >
                        <span>Guía de uso</span>
                        <span className="icon is-small">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        <div className="dropdown-item">
                            <p>Para usar el cifrado César:</p>
                            <ul>
                                <li>1. Introduzca un mensaje en mayúsculas.</li>
                                <li>2. Especifique un desplazamiento (número de posiciones).</li>
                                <li>3. Presione "Cifrar" para cifrar o "Descifrar" para el reverso.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Notification
                message="Resultado copiado al portapapeles"
                type="is-success"
                visible={notificationVisible}
            />

            <div className="field">
                <label className="label">Mensaje</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Mensaje"
                        value={message}
                        onChange={(e) => setMessage(e.target.value.toUpperCase())}
                    />
                </div>
            </div>
            <div className="field">
                <label className="label">Desplazamiento</label>
                <div className="control">
                    <input
                        className="input"
                        type="number"
                        placeholder="Desplazamiento"
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                    />
                </div>
            </div>
            <div className="buttons">
                <button className="button is-primary" onClick={handleEncrypt}>Cifrar</button>
                <button className="button is-link" onClick={handleDecrypt}>Descifrar</button>
            </div>
            <p className="subtitle">Resultado: {result}</p>
            <CopyIcon result={result} showNotification={showNotification} />
        </div>
    );
}

function ScytaleCipher() {
    const [message, setMessage] = useState('');
    const [columns, setColumns] = useState(0);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    const handleEncrypt = () => {
        if (!message || columns <= 0) {
            setError('Por favor, ingrese un mensaje y el número correcto de columnas.');
            setErrorVisible(true);
            setTimeout(() => {
                setErrorVisible(false);
            }, 2000); 
            return;
        }
        setError('');
        setErrorVisible(false);

        let encrypted = '';
        const cleanMessage = message.replace(/\s+/g, ''); 

        for (let i = 0; i < columns; i++) {
            for (let j = i; j < cleanMessage.length; j += columns) {
                encrypted += cleanMessage[j];
            }
        }

        setResult(encrypted); 
    };

    const handleDecrypt = () => {
        if (!message || columns <= 0) {
            setError('Por favor, ingrese un mensaje y el número correcto de columnas.');
            setErrorVisible(true);
            setTimeout(() => {
                setErrorVisible(false);
            }, 2000); 
            return;
        }
        setError('');
        setErrorVisible(false);

        let decrypted = new Array(message.length).fill('');
        let position = 0;

        for (let i = 0; i < columns; i++) {
            for (let j = i; j < message.length && position < message.length; j += columns) {
                decrypted[j] = message[position];
                position++;
            }
        }

        setResult(decrypted.join(''));
    };

    const showNotification = () => {
        setNotificationVisible(true);
        setTimeout(() => {
            setNotificationVisible(false);
        }, 1000); 
    };

    return (
        <div className="box" style={{ position: 'relative' }}>
            <h2 className="title is-4">Cifrado Escítala</h2>

            <div className={`dropdown ${isGuideVisible ? 'is-active' : ''} is-right is-hoverable`}>
                <div className="dropdown-trigger">
                    <button
                        className="button"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                        onClick={() => setIsGuideVisible(!isGuideVisible)}
                    >
                        <span>Guía de uso</span>
                        <span className="icon is-small">
                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        <div className="dropdown-item">
                            <p>Para usar el cifrado Escítala:</p>
                            <ul>
                                <li>1. Introduzca un mensaje sin espacios.</li>
                                <li>2. Especifique el número de columnas para la transposición.</li>
                                <li>3. Presione "Cifrar" para cifrar o "Descifrar" para el reverso.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Notification
                message={error || "Resultado copiado al portapapeles"}
                type={error ? "is-danger" : "is-success"}
                visible={errorVisible || notificationVisible}
            />

            <div className="field">
                <label className="label">Mensaje</label>
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Mensaje"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </div>
            <div className="field">
                <label className="label">Número de columnas</label>
                <div className="control">
                    <input
                        className="input"
                        type="number"
                        placeholder="Número de columnas"
                        value={columns}
                        onChange={(e) => setColumns(Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="buttons">
                <button className="button is-primary" onClick={handleEncrypt}>Cifrar</button>
                <button className="button is-link" onClick={handleDecrypt}>Descifrar</button>
            </div>
            <p className="subtitle">Resultado: {result}</p>
            <CopyIcon result={result} showNotification={showNotification} />
        </div>
    );
}

function About() {
    return (
        <div className="box">
            <h2 className="title is-4">Acerca de</h2>
            <p><strong>Nombre:</strong> Edwin Guerrero Cortez</p>
            <p><strong>Matrícula:</strong> 20221030</p>
            <p><strong>Cuatrimestre:</strong> 7° B</p>
            <p><strong>Carrera:</strong> Ingeniería en Desarrollo y Gestión de Software</p>
            <p><strong>Docente:</strong> Ing. Ana María Felipe Redondo</p>
        </div>
    );
}

function EncryptionMethods() {
    return (
        <div className="container">
            <h1 className="title is-2">Métodos de Cifrado</h1>
            <h2 className="subtitle is-3">Cifrado por método de desplazamiento y transposición</h2>

            <div className="columns">
                <div className="column">
                    <CaesarCipher />
                </div>
                <div className="column">
                    <ScytaleCipher />
                </div>
            </div>

            <About />
        </div>
    );
}

export default EncryptionMethods;
