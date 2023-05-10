import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";

const AdmAction = (props) => {
    const [dropdownItem, setDropdownItem] = useState(null);
    const toast = useRef(null);
    const dropdownItems = [
        { name: 'Yes', code: '1' },
        { name: 'No', code: '0' }
    ];

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = () => {
        toast.current.show({
            severity: "info",
            summary: "Action Selected",
            detail: ` Name: handleCreateClick`,
            life: 3000,
        });
    };

    const handleSaveClick = () => {
        toast.current.show({
            severity: "info",
            summary: "Action Selected",
            detail: ` Name: handleSaveClick`,
            life: 3000,
        });
    };

    const handleDeleteClick = () => {
        toast.current.show({
            severity: "info",
            summary: "Action Selected",
            detail: ` Name: handleDeleteClick`,
            life: 3000,
        });
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">



                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">Code</label>
                            <InputText id="code" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">Text</label>
                            <InputText id="text" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="valid">Valid</label>
                            <Dropdown id="valid" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.actionTip==='CREATE') ? (
                                <Button
                                    label="Create"
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.actionTip!=='CREATE') ? (
                                <Button
                                    label="Save"
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.actionTip!=='CREATE') ? (
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    onClick={handleDeleteClick}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmAction;
