import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserattService } from "../../service/model/AdmUserattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { usePermission, checkPermissions } from '../../security/interceptors';

const AdmUseratt = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [admUseratt, setAdmUseratt] = useState(props.admUseratt);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    //const [createButton, setCreateButton] = useState(false);
    const [hasCreatePermission, setHasCreatePermission] = useState(false);
    const [hasUpdatePermission, setHasUpdatePermission] = useState(false);
    const [hasDeletePermission, setHasDeletePermission] = useState(false);

    //const hasCreatePermission =  usePermission  ('adm_usergrp', 'CREATE');
    //console.log("**01**")
    //const hasUpdatePermission =  usePermission  ('adm_usergrp', 'UPDATE');
    //console.log("**02**")
    //const hasDeletePermission =  usePermission  ('adm_usergrp', 'DELETE');
    //console.log("**03**")

    useEffect(() => {
        async function checkPermiss() {
            try {
                console.log("**CREATE**")
                const hasButton = await checkPermissions('adm_usergrp', 'CREATE');
                setHasCreatePermission(hasButton);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        checkPermiss();
    }, []);    
    useEffect(() => {
        async function checkPermiss() {
            try {
                console.log("**UPDATE**")
                const hasButton = await checkPermissions('adm_usergrp', 'UPDATE');
                setHasUpdatePermission(hasButton);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        checkPermiss();
    }, []);    
    useEffect(() => {
        async function checkPermiss() {
            try {
                console.log("**DELETE**")
                const hasButton = await checkPermissions('adm_usergrp', 'DELETE');
                setHasDeletePermission(hasButton);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        checkPermiss();
    }, []);    

    // useEffect(() => {
    //     async function checkPermissC() {
    //         try {
    //             console.log("**CREATE_L**")
    //             const createButtonL = checkPermissions('adm_usergrp', 'CREATE');
    //             setCreateButton(createButtonL);
    //         } catch (error) {
    //             console.error(error);
    //             // Obrada greške ako je potrebna
    //         }
    //     }
    //     checkPermissC();
    // }, []);     

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.admUseratt.valid));
    }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };


    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);            
                const admUserattService = new AdmUserattService();
                const data = await admUserattService.postAdmUseratt(admUseratt);
                admUseratt.id = data
                props.handleDialogClose({ obj: admUseratt, userattTip: props.userattTip });
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
            const admUserattService = new AdmUserattService();
            await admUserattService.putAdmUseratt(admUseratt);
            props.handleDialogClose({ obj: admUseratt, userattTip: props.userattTip });
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
            const admUserattService = new AdmUserattService();
            await admUserattService.deleteAdmUseratt(admUseratt);
            props.handleDialogClose({ obj: admUseratt, userattTip: 'DELETE' });
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
            setDropdownItem(e.value);
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admUseratt = { ...admUseratt };
        _admUseratt[`${name}`] = val;
        if (name===`textx`) _admUseratt[`text`] = val

        setAdmUseratt(_admUseratt);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={admUseratt.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUseratt.code })}
                            />
                            {submitted && !admUseratt.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={admUseratt.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUseratt.text })}
                            />
                            {submitted && !admUseratt.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Tp}</label>
                            <InputText id="tp"
                                value={admUseratt.tp} onChange={(e) => onInputChange(e, "text", 'tp')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUseratt.tp })}
                            />
                            {submitted && !admUseratt.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUseratt.valid })}
                            />
                            {submitted && !admUseratt.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.userattTip === 'CREATE') &&  hasCreatePermission ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userattTip !== 'CREATE') && hasDeletePermission ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.userattTip !== 'CREATE') && hasUpdatePermission ? (
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
                item={admUseratt.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmUseratt;
