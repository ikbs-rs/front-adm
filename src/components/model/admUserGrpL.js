import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Toast } from 'primereact/toast';
import { AdmUserGrpService } from '../../service/model/AdmUserGrpService';
import AdmAkcija from './admUserGrp';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from '../../configs/translations';
import AdmUserGrp from './admUserGrp';
import { checkPermissions } from '../../security/interceptors';

export default function AdmUserGrpL(props) {
    const objName = 'adm_usergrp';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyAdmUserGrp = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [admUserGrps, setAdmUserGrps] = useState([]);
    const [admUserGrp, setAdmUserGrp] = useState(emptyAdmUserGrp);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [userGrpTip, setUserGrpTip] = useState('');
    const [hasCreatePermission, setHasCreatePermission] = useState(false);

    useEffect(() => {
        async function checkPermiss() {
            try {
                console.log("**CREATE**")
                const createButton = await checkPermissions('adm_usergrp', 'CREATE');
                console.log("####", createButton)
                setHasCreatePermission(createButton);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        checkPermiss();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const admUserGrpService = new AdmUserGrpService();
                const data = await admUserGrpService.getAdmUserGrp();
                setAdmUserGrps(data);
                initFilters();
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _admUserGrps = [...admUserGrps];
        let _admUserGrp = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.userGrpTip === 'CREATE') {
            _admUserGrps.push(_admUserGrp);
        } else if (localObj.newObj.userGrpTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _admUserGrps[index] = _admUserGrp;
        } else if (localObj.newObj.userGrpTip === 'DELETE') {
            _admUserGrps = admUserGrps.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUserGrp Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmUserGrp ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.userGrpTip}`, life: 3000 });
        setAdmUserGrps(_admUserGrps);
        setAdmUserGrp(emptyAdmUserGrp);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < admUserGrps.length; i++) {
            if (admUserGrps[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const openNew = () => {
        setAdmUserGrpDialog(emptyAdmUserGrp);
    };

    const onRowSelect = (event) => {
        toast.current.show({
            severity: 'info',
            summary: 'Action Selected',
            detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
            life: 3000
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Action Unselected',
            detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
            life: 3000
        });
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            code: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            textx: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            valid: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                {hasCreatePermission && (
                    <div className="flex flex-wrap gap-1">
                        <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                    </div>
                )}
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].UsergroupLista}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations[selectedLanguage].KeywordSearch} />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear} outlined onClick={clearFilter} text raised />
                </div>
            </div>
        );
    };

    const validBodyTemplate = (rowData) => {
        const valid = rowData.valid == 1 ? true : false;
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': valid,
                    'text-red-500 pi-times-circle': !valid
                })}
            ></i>
        );
    };

    const validFilterTemplate = (options) => {
        return (
            //createButton && 
            (
                <div className="flex align-items-center gap-2">
                    <label htmlFor="verified-filter" className="font-bold">
                        {translations[selectedLanguage].Valid}
                    </label>
                    <TriStateCheckbox inputId="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
                </div>
            )
        );
    };

    // <--- Dialog
    const setAdmUserGrpDialog = (admUserGrp) => {
        setVisible(true);
        setUserGrpTip('CREATE');
        setAdmUserGrp({ ...admUserGrp });
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const userGrpTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setAdmUserGrpDialog(rowData);
                        setUserGrpTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={admUserGrp}
                loading={loading}
                value={admUserGrps}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                scrollHeight="660px"
                virtualScrollerOptions={{ itemSize: 55 }}
                tableStyle={{ minWidth: '50rem' }}
                metaKeySelection={false}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onSelectionChange={(e) => setAdmUserGrp(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={userGrpTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column field="code" header={translations[selectedLanguage].Code} sortable filter style={{ width: '25%' }}></Column>
                <Column field="textx" header={translations[selectedLanguage].Text} sortable filter style={{ width: '60%' }}></Column>
                <Column
                    field="valid"
                    filterField="valid"
                    dataType="numeric"
                    header={translations[selectedLanguage].Valid}
                    sortable
                    filter
                    filterElement={validFilterTemplate}
                    style={{ width: '15%' }}
                    bodyClassName="text-center"
                    body={validBodyTemplate}
                ></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Usergroup}
                visible={visible}
                style={{ width: '70%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <AdmUserGrp parameter={'inputTextValue'} admUserGrp={admUserGrp} handleDialogClose={handleDialogClose} setVisible={setVisible} dialog={true} userGrpTip={userGrpTip} />}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>
        </div>
    );
}
