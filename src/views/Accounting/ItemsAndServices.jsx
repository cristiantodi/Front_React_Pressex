import { useState, useEffect, useContext } from 'react';
import Table from '../shared/components/Table';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ModalForm from '../shared/components/ModalForm';
import ItemAndServiceCreationForm from '../forms/ItemAndServiceCreationForm';
import { useModal } from '../../hooks/useModal'; // Import the useModal hook
import ItemsAndServicesService from '../../services/ItemsAndServicesService';
import Sidebar from '../shared/components/SideBar';
import { GlobalContext } from '../../context/global';

const ItemsAndServices = () => {
    const [itemsAndServices, setItemsAndServices] = useState([]);
    const [isOpen, openModal, closeModal] = useModal(false);
    const [selectedeItemAndService, setSelectedItemAndService] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [nextPageURL, setNextPageURL] = useState('');
    const [initialDataFetched, setInitialDataFetched] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const columns = [
        'Code',
        'Description',
        'Type',
        'Amount',
        'Currency',
        'IATA Code',
    ];

    const { hideShowSlider } = useContext(GlobalContext);

    useEffect(() => {
        const handleDocumentClick = (e) => {
            // Check if the click is inside the context menu or a table row
            const contextMenu = document.querySelector('.context-menu');
            if (contextMenu && !contextMenu.contains(e.target)) {
                // Click is outside the context menu, close it
                setShowContextMenu(false);
            }
        };

        // Add the event listener when the component mounts
        document.addEventListener('click', handleDocumentClick);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [showContextMenu]); // Only re-add the event listener when showContextMenu changes

    const updateItemsAndServices = (url = null) => {
        ItemsAndServicesService.getItemsAndServices(url)
            .then((response) => {
                const newItemsAndServices = response.data.results.filter(
                    (ItemServices) => {
                        const ItemsAndServicestId = ItemServices.id;
                        return !itemsAndServices.some(
                            (existingPickupOrder) =>
                                existingPickupOrder.id === ItemsAndServicestId
                        );
                    }
                );

                setItemsAndServices([...response.data.results].reverse());

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
            updateItemsAndServices();
            setInitialDataFetched(true);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && nextPageURL) {
                updateItemsAndServices(nextPageURL);
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

    const handleItemAndServiceDataChange = () => {
        updateItemsAndServices();
    };

    const handleSelectItemAndService = (PickupOrder) => {
        setSelectedItemAndService(PickupOrder);
    };

    const handleEditItemAndService = () => {
        if (selectedeItemAndService) {
            setIsEdit(true);
            openModal();
        } else {
            alert('Please select an Items & Services to edit.');
        }
    };

    const handleAddItemAndService = () => {
        openModal();
    };

    useEffect(() => {}, [isEdit]);

    const handleDeleteItemAndService = () => {
        if (selectedeItemAndService) {
            ItemsAndServicesService.deleteItemAndService(
                selectedeItemAndService.id
            )
                .then((response) => {
                    if (response.status == 204) {
                        setShowSuccessAlert(true);
                        setTimeout(() => {
                            setShowSuccessAlert(false);
                        }, 1000);
                    } else {
                        setShowErrorAlert(true);
                        setTimeout(() => {
                            setShowErrorAlert(false);
                        }, 1000);
                    }
                })
                .catch((error) => {});
        } else {
            alert('Please select anItems & Services to delete.');
        }
    };

    useEffect(() => {
        const handleWindowClick = (event) => {
            const clickedElement = event.target;
            const isItemAndServiceButton =
                clickedElement.classList.contains('ne');
            const isTableRow = clickedElement.closest('.table-row');
            if (!isItemAndServiceButton && !isTableRow && !isEdit) {
                setSelectedItemAndService(null);
            }
        };

        window.addEventListener('click', handleWindowClick);

        return () => {
            window.removeEventListener('click', handleWindowClick);
        };
    });

    return (
        <>
            <div className="dashboard__sidebar sombra">
                <div className="dashboard__sidebar sombra">
                    <Sidebar />
                    <div
                        className="content-page"
                        style={
                            !hideShowSlider
                                ? {
                                      marginLeft: '22rem',
                                      width: 'calc(100vw - 250px)',
                                  }
                                : { marginInline: 'auto' }
                        }
                    >
                        <Table
                            data={itemsAndServices}
                            columns={columns}
                            onSelect={handleSelectItemAndService} // Make sure this line is correct
                            selectedRow={selectedeItemAndService}
                            onDelete={handleDeleteItemAndService}
                            onEdit={handleEditItemAndService}
                            onAdd={handleAddItemAndService}
                            title="Items & Services"
                            setData={setItemsAndServices}
                            showContextMenu={showContextMenu}
                            setShowContextMenu={setShowContextMenu}
                            importEnabled={false}
                            importLabel={false}
                        >
                            {selectedeItemAndService === null && (
                                <ItemAndServiceCreationForm
                                    ItemServices={null}
                                    closeModal={closeModal}
                                    creating={true}
                                    onDataChange={
                                        handleItemAndServiceDataChange
                                    }
                                />
                            )}

                            {selectedeItemAndService !== null && (
                                <ItemAndServiceCreationForm
                                    ItemServices={selectedeItemAndService}
                                    closeModal={closeModal}
                                    creating={false}
                                    onDataChange={
                                        handleItemAndServiceDataChange
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
                                    Item and Service deleted successfully!
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
                                    Error deleting Item and Service. Please try
                                    again
                                </strong>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemsAndServices;
