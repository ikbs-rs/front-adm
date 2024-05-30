import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserPermissService } from "../../service/model/AdmUserPermissService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { AdmRollService } from "../../service/model/AdmRollService";
import { translations } from "../../configs/translations";
import { AutoComplete } from "primereact/autocomplete";

const AdmUserPermiss = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admUserPermiss, setAdmUserPermiss] = useState(props.admUserPermiss);
    const [submitted, setSubmitted] = useState(false);
    const [ddRollItem, setDdRollItem] = useState(null);
    const [ddRollItems, setDdRollItems] = useState(null);

    //const [allRolles, setAllRolles] = useState([]);
    //const [rollValue, setRollValue] = useState("");
    //const [filteredRolles, setFilteredRolles] = useState([]);
    //const [selectedRoll, setSelectedRoll] = useState(null);
    // const [debouncedSearch, setDebouncedSearch] = useState("");
    // const [searchTimeout, setSearchTimeout] = useState(null);

    const [allRolles, setAllRolles] = useState([]);
    const [rollValue, setRollValue] = useState("");
    const [filteredRolles, setFilteredRolles] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedRoll, setSelectedRoll] = useState(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const admRollService = new AdmRollService();
            const data = await admRollService.getAdmRollX();
            console.log(data, "* setAllRolles ************************************************************************")
            setAllRolles(data);
            const findItem = data.find((item) => item.id === props.admUserPermiss.roll) || null
            setRollValue(findItem?.code);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (debouncedSearch && selectedRoll === null) {
            // Filtrirajte podatke na osnovu trenutnog unosa
            const query = debouncedSearch.toLowerCase();
            const filtered = allRolles.filter(
                (roll) =>
                    roll.textx.toLowerCase().includes(query) ||
                    roll.code.toLowerCase().includes(query) ||
                    roll.id.toLowerCase().includes(query)
            );

            setSelectedRoll(null);
            setFilteredRolles(filtered);
        }
    }, [debouncedSearch, allRolles]);

    useEffect(() => {
        // Samo kada je izabrani element `null`, izvršavamo `onChange`
console.log(rollValue, "----------------------####################-------------")
        setRollValue(rollValue);
    }, [rollValue, selectedRoll]);

    const handleSelect = (e) => {
        // Postavite izabrani element i automatski popunite polje za unos sa vrednošću "code"
        setSelectedRoll(e.value.code);
        setRollValue(e.value.code);
    };

    // useEffect(() => {
    //     if (debouncedSearch && selectedRoll === null) {
    //         // Filtrirajte podatke na osnovu trenutnog unosa
    //         const query = debouncedSearch.toLowerCase();
    //         const filtered = allRolles.filter(
    //             (roll) =>
    //                 roll.textx.toLowerCase().includes(query) ||
    //                 roll.code.toLowerCase().includes(query) ||
    //                 roll.id.toLowerCase().includes(query)
    //         );
    //         setSelectedRoll(null);
    //         setFilteredRolles(filtered);
    //     }
    // }, [debouncedSearch, allRolles]);

    // useEffect(() => {
    //     // Samo kada je izabrani element `null`, izvršavamo `onChange`
    //     setRollValue(rollValue);
    // }, [rollValue, selectedRoll]);
    /** auto */

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const admUserPermissService = new AdmUserPermissService();
            const data = await admUserPermissService.postAdmUserPermiss(admUserPermiss);
            admUserPermiss.id = data
            props.handleDialogClose({ obj: admUserPermiss, userPermissTip: props.userPermissTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const admUserPermissService = new AdmUserPermissService();
            await admUserPermissService.putAdmUserPermiss(admUserPermiss);
            props.handleDialogClose({ obj: admUserPermiss, userPermissTip: props.userPermissTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const admUserPermissService = new AdmUserPermissService();
            await admUserPermissService.deleteAdmUserPermiss(admUserPermiss);
            props.handleDialogClose({ obj: admUserPermiss, userPermissTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            setDdRollItem(e.value);
            admUserPermiss.rtext = e.value.name
            admUserPermiss.rcode = e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "auto") {
            if (selectedRoll === null) {
                setRollValue(e.target.value.textx || e.target.value);
            } else {
                setSelectedRoll(null);
                setRollValue(e.target.value.textx || e.target.value.textx);
            }
            admUserPermiss.rtext = e.target.value.textx
            admUserPermiss.rcode = e.target.value.code
            // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
            clearTimeout(searchTimeout);
            const timeout = setTimeout(() => {
                setDebouncedSearch(e.target.value);
            }, 400);

            setSearchTimeout(timeout);
            val = (e.target && e.target.value && e.target.value.id) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admUserPermiss = { ...admUserPermiss };
        _admUserPermiss[`${name}`] = val;
        setAdmUserPermiss(_admUserPermiss);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };


    const rollTemplate = (item) => {
        return (
            <>
                <div>
                    {item.textx}
                    {` `}
                    {item.code}
                </div>
                <div>
                    {item.id}
                </div>
            </>
        );
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="code">{translations[selectedLanguage].Username}</label>
                            <InputText id="code"
                                value={props.admUser.username}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Mail}</label>
                            <InputText
                                id="mail"
                                value={props.admUser.mail}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        {/* <div className="field col-12 md:col-6">
                            <label htmlFor="roll">{translations[selectedLanguage].Roll} *</label>
                            <Dropdown id="roll"
                                value={ddRollItem}
                                options={ddRollItems}
                                onChange={(e) => onInputChange(e, "options", 'roll')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUserPermiss.roll })}
                            />
                            {submitted && !admUserPermiss.roll && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="roll">{translations[selectedLanguage].Roll} *</label>
                            <AutoComplete
                                value={rollValue}
                                suggestions={filteredRolles}
                                completeMethod={() => { }}
                                onSelect={handleSelect}
                                onChange={(e) => onInputChange(e, "auto", 'roll')}
                                itemTemplate={rollTemplate} // Koristite itemTemplate za prikazivanje objekata
                                placeholder="Pretraži zemlje"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label={translations[selectedLanguage].Cancel}
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.userPermissTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userPermissTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.userPermissTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={admUserPermiss.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmUserPermiss;
