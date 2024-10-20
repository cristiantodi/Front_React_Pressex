import { useState, useEffect } from 'react';
import PackageTypeService from '../../services/PackageTypeService';
import LocationService from '../../services/LocationService';
const RepackingForm = ({ commodities, setCommodities }) => {
    const [packTypes, setpackTypes] = useState([]);
    const [internalCommodities, setinternalCommodities] = useState([]);
    const [id, setId] = useState(0);

    const formFormat = {
        package_type_id: '',
        package_type_description: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        volumen: '',
        volumetricWeight: '',
        chargedWeight: '',
        description: '',
        useInternalWeight: false,
        locationId: '',
        locationCode: '',
    };
    const [formData, setformData] = useState(formFormat);
    //added unrepack
    const [repackedItems, setRepackedItems] = useState([]);
    const [selectedRepackId, setSelectedRepackId] = useState(null);
    const [locations, setlocations] = useState([]);

    useEffect(() => {
        PackageTypeService.getPackageTypes()
            .then((response) => {
                setpackTypes(response.data.results);
            })
            .catch((error) => {});
    }, []);

    useEffect(() => {
        LocationService.getLocations().then((response) => {
            setlocations(response.data.results);
        });
    }, []);

    useEffect(() => {
        if (formData.height && formData.width && formData.length) {
            const vol = (
                (formData.height * formData.width * formData.length) /
                1728
            ).toFixed(2);
            const volWeight = (
                (formData.height * formData.width * formData.length) /
                166
            ).toFixed(2);

            setformData((prevFormData) => ({
                ...prevFormData,
                volumen: vol,
                volumetricWeight: volWeight,
                chargedWeight: Math.max(volWeight, prevFormData.weight),
            }));
        }
    }, [formData.height, formData.length, formData.width, formData.weight]);

    const handleCommoditySelection = (e, commodityId) => {
        const isChecked = e.target.checked;

        setinternalCommodities((prevCommodities) => {
            const updatedCommodities = isChecked
                ? [...prevCommodities, getCommodityById(commodityId)]
                : prevCommodities.filter((item) => item.id !== commodityId);

            setSelectedRepackId(isChecked ? commodityId : null); // Almacena el ID del empaquetado seleccionado
            return updatedCommodities;
        });
    };

    const getCommodityById = (commodityId) => {
        return commodities.find((item) => item.id === commodityId);
    };
    //added unrepack
    /* const handleUNRepack = () => {
    if (selectedRepackId) {
      const remainingRepackedItems = repackedItems.filter(
        (item) => item.id !== selectedRepackId
      );

      const repackedItem = repackedItems.find(
        (item) => item.id === selectedRepackId
      );
      
      if (repackedItem) {
        const remainingCommodities = commodities.filter(
          (commodity) => commodity.id !== repackedItem.id
        );

        const unpackedCommodities = [...repackedItem.internalCommodities];

        setCommodities([...unpackedCommodities, ...remainingCommodities]);

        setRepackedItems(remainingRepackedItems);

        // Limpia el ID del empaquetado seleccionado
        setSelectedRepackId(null);
      }
    }
  }; */

    const handleRepack = () => {
        //added validation of the form
        if (
            !formData.package_type_description ||
            !formData.length ||
            !formData.height ||
            !formData.width ||
            !formData.weight ||
            !formData.description ||
            !formData.locationId
        ) {
            // Show an alert or handle the validation error as needed
            alert('Please fill in all required fields in the form repack.');
            return;
        }
        //Show alert validation check cimmodities for repack
        if (internalCommodities.length === 0) {
            alert('Please select at least one commodity to repack');
            return;
        }

        let internalWeight = formData.weight; //added thing for repack
        if (formData.useInternalWeight) {
            internalCommodities.forEach((element) => {
                internalWeight += Number(element.weight);
            });
        }
        const selectedCommodityIds = internalCommodities.map((com) =>
            String(com.id)
        );
        const filteredCommodities = commodities.filter((commodity) => {
            return !selectedCommodityIds.includes(String(commodity.id));
        });

        // Encontrar el máximo ID de repack existente en commodities repacked
        const maxRepackID = commodities.reduce((max, item) => {
            if (item.id && typeof item.id === 'string') {
                const match = item.id.match(/^repacked-(\d+)$/);
                if (match) {
                    const repackNumber = parseInt(match[1], 10);
                    return Math.max(max, repackNumber);
                }
            }
            return max;
        }, 0);

        // Calcular el nuevo ID sumando 1 al máximo ID encontrado
        const newCommodityID = `repacked-${maxRepackID + 1}`;

        const newCommodity = {
            ...formData,
            id: newCommodityID,
            weight: internalWeight,
            containsCommodities: true,
            internalCommodities: internalCommodities,
        };

        setCommodities([...filteredCommodities, newCommodity]);
        //setId(id + 1);

        setformData(formFormat);
        setinternalCommodities([]);

        //added things for repack

        setRepackedItems((prevRepackedItems) => [
            ...prevRepackedItems,
            { ...newCommodity },
        ]);
    };

    const sortedPackTypes = packTypes.sort((a, b) => {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
    });

    return (
        <div className="income-charge-form">
            <div className="form-label_name">
                <h2>Repacking Form</h2>
                <span></span>
            </div>

            <div className="form-row">
                <div className="form-column-create">
                    <label className="text-comm">Length:</label>
                    <div className="input-group-r ">
                        <input
                            type="number"
                            className="form-comm"
                            aria-label=""
                            value={formData.length}
                            onChange={(e) =>
                                setformData({
                                    ...formData,
                                    length: e.target.value,
                                })
                            }
                        />
                        <span className="input-group-text num-com">in</span>
                    </div>
                </div>

                <div className="form-column-create">
                    <label className="text-comm">Width:</label>
                    <div className="input-group-r ">
                        <input
                            type="number"
                            className="form-comm"
                            aria-label=""
                            value={formData.width}
                            onChange={(e) =>
                                setformData({
                                    ...formData,
                                    width: e.target.value,
                                })
                            }
                        />
                        <span className="input-group-text num-com">in</span>
                    </div>
                </div>

                <div className="form-column-create">
                    <label className="text-comm">Height:</label>
                    <div className="input-group-r ">
                        <input
                            type="number"
                            className="form-comm"
                            aria-label=""
                            value={formData.height}
                            onChange={(e) =>
                                setformData({
                                    ...formData,
                                    height: e.target.value,
                                })
                            }
                        />
                        <span className="input-group-text num-com">in</span>
                    </div>
                </div>

                <div className="form-column-create">
                    <label className="text-comm">Weigth:</label>
                    <div className="input-group-r ">
                        <input
                            type="number"
                            className="form-comm"
                            aria-label=""
                            value={formData.weight}
                            onChange={(e) =>
                                setformData({
                                    ...formData,
                                    weight: e.target.value,
                                })
                            }
                            disabled={formData.useInternalWeight}
                        />
                        <span className="input-group-text num-com">lb</span>
                    </div>
                </div>

                {/* <div className="form-column-create">
          <label className="text-comm">Volume:</label>
          <div className="input-group-r ">
            <input
              type="number"
              className="form-comm"
              aria-label=""
              value={formData.volumetricWeight}
              readOnly
            />
            <span className="input-group-text num-com">ft3</span>
          </div>
        </div> */}
                <div className="form-column-create">
                    <label className="text-comm">Volume:</label>
                    <div className="input-group-r ">
                        <input
                            type="number"
                            className="form-comm"
                            aria-label=""
                            value={formData.volumen}
                            readOnly
                        />
                        <span className="input-group-text num-com">ft3</span>
                    </div>
                </div>

                <div className="row w-100">
                    <div className="col-6">
                        <label
                            htmlFor="description"
                            className="text-comm description-form"
                        >
                            Description:
                        </label>
                        <input
                            name="description"
                            type="text"
                            className="form-input"
                            placeholder="Description..."
                            value={formData.description}
                            onChange={(e) =>
                                setformData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="col-6">
                        <label
                            htmlFor="containerType"
                            className="text-comm description-form"
                        >
                            Container Type:
                        </label>{' '}
                        <select
                            name="containerType"
                            className="container-type"
                            id="containerType"
                            value={formData.package_type_id}
                            onChange={(e) => {
                                setformData({
                                    ...formData,
                                    package_type_id: e.target.value,
                                    package_type_description:
                                        e.target.options[e.target.selectedIndex]
                                            .text,
                                });
                            }}
                            style={{
                                fontSize: '14px',
                                color: 'gray',
                                padding: '3px',
                            }}
                        >
                            <option value="">Select an option</option>
                            {sortedPackTypes.map((type) => {
                                return (
                                    <option value={type.id} key={type.id}>
                                        {type.description}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <div className="form-column-create" style={{ width: '99%' }}>
                    <label htmlFor="location" className="text-comm">
                        Location:
                    </label>
                    <select
                        name="location"
                        id="location"
                        value={formData.locationId}
                        onChange={(e) => {
                            setformData({
                                ...formData,
                                locationId: e.target.value,
                                locationCode:
                                    e.target.options[
                                        e.target.selectedIndex
                                    ].getAttribute('data-key'),
                            });
                        }}
                        style={{
                            fontSize: '14px',
                            color: 'gray',
                            padding: '4px',
                        }}
                    >
                        <option value="">Select an option</option>
                        {locations.map((location) => {
                            return (
                                <option
                                    key={location.id}
                                    value={location.id}
                                    data-key={location.code}
                                >
                                    {location.code}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="useinter">
                <p style={{ margin: '1rem', fontSize: '15px' }}>
                    Select items to be repacked
                </p>
                <table
                    id="tableware"
                    style={{ width: '0%', border: '2px solid black' }}
                >
                    <tr style={{ display: 'none' }}>
                        {/* desabilitado de uso de peso interno */}
                        <td>
                            <label className="textpack" htmlFor="">
                                use internal commodity weight
                            </label>
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                value={formData.useInternalWeight}
                                onChange={(e) => {
                                    setformData({
                                        ...formData,
                                        useInternalWeight: e.target.checked,
                                    });
                                }}
                            />
                        </td>
                    </tr>
                </table>
            </div>
            {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}
            <div style={{ margin: '1rem' }}>
                {commodities.map((item) => (
                    <div key={item.id} cl className="position-table">
                        <table id="tableware">
                            <tr>
                                <td className="checkrepack">
                                    <input
                                        type="checkbox"
                                        id={`commodity-${item.id}`}
                                        value={item.id}
                                        checked={internalCommodities
                                            .map((com) => com.id)
                                            .includes(item.id)}
                                        onChange={(e) =>
                                            handleCommoditySelection(e, item.id)
                                        }
                                    />
                                </td>
                                <td className="textpack">
                                    <label
                                        className="textpack"
                                        htmlFor={`commodity-${item.id}`}
                                    >
                                        {item.description} - {item.length}x
                                        {item.width}x{item.height}
                                    </label>
                                </td>
                            </tr>
                        </table>
                    </div>
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '1rem',
                    gap: '4rem',
                }}
            >
                {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}
                <div>
                    <button
                        type="button"
                        className="button-save"
                        onClick={handleRepack}
                    >
                        Repacking
                    </button>
                </div>
                {/* hiden unrepack button */}
                {/* <div>
          <button
            type="button"
            className="button-save"
            onClick={handleUNRepack}
          >
            UnRepack
          </button>
        </div> */}
            </div>
        </div>
    );
};

export default RepackingForm;
