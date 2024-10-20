import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({ onHide, onConfirm, title, body }) {
    return (
        <Modal
            style={{ marginTop: '10%', marginLeft: '30%', width: '40%' }}
            show={true}
        >
            <Modal.Header>
                <Modal.Title
                    style={{
                        color: '#006bad',
                        fontWeight: 'bold',
                        fontSize: '15px',
                    }}
                >
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ width: '100%', fontSize: '16px' }}>
                {body}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    style={{
                        color: 'white',
                        background: '#006bad',
                        borderRadius: '5px',
                        fontSize: '14px',
                    }}
                    onClick={onHide}
                >
                    Cancel
                </Button>

                <Button
                    style={{
                        color: 'white',
                        background: '#006bad',
                        borderRadius: '5px',
                        fontSize: '14px',
                    }}
                    onClick={onConfirm}
                >
                    Accept
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;
