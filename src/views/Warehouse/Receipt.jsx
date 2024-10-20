import { useState, useEffect, useContext } from 'react';
import Table from '../shared/components/Table';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ModalForm from '../shared/components/ModalForm';
import ReceiptCreationForm from '../forms/ReceiptCreationForm';
import { useModal } from '../../hooks/useModal'; // Import the useModal hook
import ReceiptService from '../../services/ReceiptService';
import Sidebar from '../shared/components/SideBar';
import { GlobalContext } from '../../context/global';
import PickupService from '../../services/PickupService';
import ReleaseOrderCreationForm from '../forms/ReleaseOrderCreationForm';

const Receipt = () => {
    const { hideShowSlider } = useContext(GlobalContext);
    const [receipts, setreceipts] = useState([]);
    const [isOpen, openModal, closeModal] = useModal(false);
    const [selectedPickupOrder, setSelectedPickupOrder] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [nextPageURL, setNextPageURL] = useState('');
    const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [initialDataFetched, setInitialDataFetched] = useState(false);
    const [createReceiptOrder, setCreateReceiptOrder] = useState(true);
    //added for creation realease
    const [createRealeaseOrder, setCreateReleaseOrder] = useState(false);
    const [
        isOpenReleaseCreation,
        openModalReleaseCreation,
        closeModalReleaseCreation,
    ] = useModal(false);
    //added menu context
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    });
    const StatusOnHand = 4;
    const StatusInTransit = 6;
    const StatusDelivered = 9;
    const StatusOnHold = 12;
    const StatusPending = 2;
    const StatusLoaded = 1;
    //------------
    const columns = [
        'Status',
        'Number',
        // "Date",
        'Creation Date',
        'Shipper Name',
        'Consignee Name',
        'Carrier Name',
        'Pieces',
        // "Weight",
        'Weight (lb)',
        'Volumen (ft3)',
        'View Receipt PDF',
    ];

    const updatereceipts = (url = null) => {
        ReceiptService.getReceipts(url)
            .then((response) => {
                const newreceipts = response.data.results.filter(
                    (pickupOrder) => {
                        const pickupOrderId = pickupOrder.id;
                        return !receipts.some(
                            (existingPickupOrder) =>
                                existingPickupOrder.id === pickupOrderId
                        );
                    }
                );

                setreceipts([...receipts, ...newreceipts].reverse());
                //
                // if (pickupOrderId) {
                //
                // }

                // if (pickupOrderId == null) {
                //
                // }
                // if (!pickupOrderId) {
                //
                // }

                if (response.data.next) {
                    setNextPageURL(response.data.next);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (!initialDataFetched) {
            updatereceipts();
            setInitialDataFetched(true);
        }
    }, []);

    useEffect(() => {
        if (initialDataFetched) {
            const number = receipts[0]?.number || 0;

            setcurrentPickupNumber(number);
        }
    }, [receipts]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && nextPageURL) {
                updatereceipts(nextPageURL);
            }
        });

        const lastRow = document.querySelector('.table-row:last-child');
        if (lastRow) {
            observer.observe(lastRow);
        }

        return () => {
            observer.disconnect();
        };
    }, [nextPageURL]);

    const handlereceiptsDataChange = () => {
        updatereceipts();
    };

    const handleSelectPickupOrder = (PickupOrder) => {
        console.log(PickupOrder);
        setSelectedPickupOrder(PickupOrder);
    };

    const handleEditreceipts = () => {
        if (selectedPickupOrder) {
            setIsEdit(true);
            setCreateReceiptOrder(false);
            openModal();
        } else {
            alert('Please select a Pickup Order to edit.');
        }
    };

    const handleAddPickupOrder = () => {
        setCreateReceiptOrder(true);
        openModal();
    };

    const handleDeletePickupOrder = async () => {
        if (selectedPickupOrder) {
            try {
                // Obtener todas las pickups
                const response = await PickupService.getPickups();
                const resultsArray = response.data.results;

                for (let i = 0; i < resultsArray.length; i++) {
                    const pickUpLocationObj = resultsArray[i].number;
                    const getpickupOrderId = resultsArray[i].id;

                    if (pickUpLocationObj === selectedPickupOrder.number) {
                        const getpickupforId =
                            await PickupService.getPickupById(getpickupOrderId);
                        const newPickup = { ...getpickupforId, status: 14 };
                        // Actualizar la pickup con el nuevo estado de empty
                        await PickupService.updatePickup(
                            getpickupOrderId,
                            newPickup
                        );
                        //

                        // Después de la actualización, proceder con ReceiptService para eliminarlo
                        try {
                            await ReceiptService.deleteReceipt(
                                selectedPickupOrder.id
                            );
                            //

                            // Actualizar el estado de receipts eliminando la orden
                            const newreceipts = receipts.filter(
                                (order) => order.id !== selectedPickupOrder.id
                            );
                            setreceipts(newreceipts);

                            setShowSuccessAlert(true);
                            setTimeout(
                                () => {
                                    setShowSuccessAlert(false);
                                },
                                window.location.reload(),
                                1000
                            );
                        } catch (error) {
                            console.error(
                                'Error al eliminar el recibo:',
                                error
                            );
                            setShowErrorAlert(true);
                            setTimeout(() => {
                                setShowErrorAlert(false);
                            }, 1000);
                        }

                        // Salir del bucle después de la actualización
                        break;
                    }
                }
            } catch (error) {
                console.error('Error al obtener las pickups:', error);
            }
        } else {
            alert('Por favor, selecciona una Orden de Recogida para eliminar.');
        }
    };

    //added context menu

    /*  const setOnHold = async () => {
    if (selectedPickupOrder) {
      const updatedPickuporder = {
        ...selectedPickupOrder,
        status: StatusOnHold,
      };
      const response = await ReceiptService.updateReceipt(
        selectedPickupOrder.id,
        updatedPickuporder
      );
      if (response.status === 200) {
        window.location.reload(true);
      }
    } else {
      alert("Please select a pickup order to continue.");
    }
  };

  const setInTransit = async () => {
    if (selectedPickupOrder) {
      const updatedPickuporder = {
        ...selectedPickupOrder,
        status: StatusInTransit,
      };
      const response = await ReceiptService.updateReceipt(
        selectedPickupOrder.id,
        updatedPickuporder
      );
      if (response.status === 200) {
        window.location.reload(true);
      }
    } else {
      alert("Please select a pickup order to continue.");
    }
  };

  const setDelivered = async () => {
    if (selectedPickupOrder) {
      const updatedPickuporder = {
        ...selectedPickupOrder,
        status: StatusDelivered,
      };
      const response = await ReceiptService.updateReceipt(
        selectedPickupOrder.id,
        updatedPickuporder
      );
      if (response.status === 200) {
        window.location.reload(true);
      }
    } else {
      alert("Please select a pickup order to continue.");
    }
  };

  const setOnHand = async () => {
    if (selectedPickupOrder) {
      const updatedPickuporder = {
        ...selectedPickupOrder,
        status: StatusOnHand,
      };
      const response = await ReceiptService.updateReceipt(
        selectedPickupOrder.id,
        updatedPickuporder
      );
      if (response.status === 200) {
        window.location.reload(true);
      }
    } else {
      alert("Please select a pickup order to continue.");
    }
  };

  const setPending = async () => {
    if (selectedPickupOrder) {
      const updatedPickuporder = {
        ...selectedPickupOrder,
        status: StatusPending,
      };
      const response = await ReceiptService.updateReceipt(
        selectedPickupOrder.id,
        updatedPickuporder
      );
      if (response.status === 200) {
        window.location.reload(true);
      }
    } else {
      alert("Please select a pickup order to continue.");
    }
  };

  const setLoaded = async () => {
    if (selectedPickupOrder) {
      const updatedPickuporder = {
        ...selectedPickupOrder,
        status: StatusLoaded,
      };
      const response = await ReceiptService.updateReceipt(
        selectedPickupOrder.id,
        updatedPickuporder
      );
      if (response.status === 200) {
        window.location.reload(true);
      }
    } else {
      alert("Please select a pickup order to continue.");
    }
  }; */
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    // Función para cambiar el estado
    const toggleLogin = () => {
        // Cambiar el estado inverso del estado actual
        setIsLoggedIn(!isLoggedIn);
    };

    const seteRealease = () => {
        if (selectedPickupOrder) {
            setCreateReleaseOrder(true);
            toggleLogin();
        } else {
            alert('Please select a receipt to continue.');
        }
    };

    useEffect(() => {
        if (createRealeaseOrder) {
            openModalReleaseCreation();
        }
    }, [createRealeaseOrder]);

    const contextMenuOptions = [
        {
            label: 'Create Release Order',
            handler: seteRealease,
        },
    ];

    const handleContextMenu = (e) => {
        if (selectedPickupOrder && selectedPickupOrder.status == StatusOnHand) {
            e.preventDefault(); // Prevent the browser's default context menu
            const clickX = e.clientX;
            const clickY = e.clientY;
            setContextMenuPosition({ x: clickX, y: clickY });
            setShowContextMenu(true);
        }
    };

    // Add the event listener for context menu
    useEffect(() => {
        const handleDocumentClick = (e) => {
            const contextMenu = document.querySelector('.context-menu');
            if (contextMenu && !contextMenu.contains(e.target)) {
                setShowContextMenu(false);
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [showContextMenu]); // Only re-add the event listener when showContextMenu changes

    useEffect(() => {
        const handleWindowClick = (event) => {
            const clickedElement = event.target;
            const isreceiptsButton = clickedElement.classList.contains('ne');
            const isTableRow = clickedElement.closest('.table-row');
            const isInsideCompanyFormPickup =
                clickedElement.closest('.company-form');
            const isSelectMenu = event.target.id.includes('react-select');

            if (
                !isreceiptsButton &&
                !isTableRow &&
                !isEdit &&
                !isInsideCompanyFormPickup &&
                !isSelectMenu
            ) {
                //para que no se cierre release creation se comenta
                //setSelectedPickupOrder(null);
            }
        };

        window.addEventListener('click', handleWindowClick);

        return () => {
            window.removeEventListener('click', handleWindowClick);
        };
    });

    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <>
            <div className="dashboard__layout">
                <div className="dashboard__sidebar sombra">
                    <Sidebar />
                    <div
                        className="content-page"
                        style={
                            !hideShowSlider
                                ? {
                                      marginLeft: '21rem',
                                      width: 'calc(100vw - 250px)',
                                  }
                                : { marginInline: 'auto' }
                        }
                    >
                        <Table
                            className="centered-table"
                            noScroll
                            data={receipts}
                            columns={columns}
                            onSelect={handleSelectPickupOrder} // Make sure this line is correct
                            selectedRow={selectedPickupOrder}
                            onDelete={handleDeletePickupOrder}
                            onEdit={handleEditreceipts}
                            onAdd={handleAddPickupOrder}
                            handleContextMenu={handleContextMenu}
                            showContextMenu={showContextMenu}
                            contextMenuPosition={contextMenuPosition}
                            setShowContextMenu={setShowContextMenu}
                            contextMenuOptions={contextMenuOptions}
                            title={
                                isLoggedIn
                                    ? 'Warehouse Receipts'
                                    : 'Realese Orders'
                            }
                            setData={setreceipts}
                            contextService={ReceiptService}
                            importEnabled={false}
                            centeredColumns={[2, 7]}
                            createWarehouseReceipt={createRealeaseOrder}
                        >
                            {selectedPickupOrder !== null && (
                                <ReceiptCreationForm
                                    pickupOrder={selectedPickupOrder}
                                    closeModal={handleCancel}
                                    creating={false}
                                    onpickupOrderDataChange={
                                        handlereceiptsDataChange
                                    }
                                    currentPickUpNumber={currentPickupNumber}
                                    setcurrentPickUpNumber={
                                        setcurrentPickupNumber
                                    }
                                    fromReceipt={true}
                                />
                            )}

                            {selectedPickupOrder === null && (
                                <ReceiptCreationForm
                                    pickupOrder={null}
                                    closeModal={handleCancel}
                                    creating={createReceiptOrder}
                                    onpickupOrderDataChange={
                                        handlereceiptsDataChange
                                    }
                                    currentPickUpNumber={currentPickupNumber}
                                    setcurrentPickUpNumber={
                                        setcurrentPickupNumber
                                    }
                                />
                            )}
                        </Table>

                        {showSuccessAlert && (
                            <Alert
                                severity="success"
                                onClose={() => setShowSuccessAlert(false)}
                                className="alert-notification"
                            >
                                <AlertTitle>Success</AlertTitle>
                                <strong>
                                    Receipt Order deleted successfully!
                                </strong>
                            </Alert>
                        )}
                        {showErrorAlert && (
                            <Alert
                                severity="error"
                                onClose={() => setShowErrorAlert(false)}
                                className="alert-notification"
                            >
                                <AlertTitle>Error</AlertTitle>
                                <strong>
                                    Error deleting Receipt. Please try again
                                </strong>
                            </Alert>
                        )}

                        {selectedPickupOrder !== null &&
                            createRealeaseOrder && (
                                <div className="layout-fluid_form">
                                    <ReleaseOrderCreationForm
                                        releaseOrder={selectedPickupOrder}
                                        closeModal={closeModalReleaseCreation}
                                        creating={true}
                                        onReleaseOrderDataChange={
                                            handlereceiptsDataChange
                                        }
                                        currentReleaseNumber={
                                            currentPickupNumber
                                        }
                                        setcurrentReleaseNumber={
                                            setcurrentPickupNumber
                                        }
                                        fromRecipt={true}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Receipt;
