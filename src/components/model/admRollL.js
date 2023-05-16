import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmRollService } from "../../service/model/AdmRollService";
import AdmAkcija from './admRoll';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';


export default function AdmRollL(props) {
  const objName = "adm_roll"
  const emptyAdmRoll = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admRolls, setAdmRolls] = useState([]);
  const [admRoll, setAdmRoll] = useState(emptyAdmRoll);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [rollTip, setRollTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const admRollService = new AdmRollService();
        const data = await admRollService.getAdmRollV();
        setAdmRolls(data);
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

    let _admRolls = [...admRolls];
    let _admRoll = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.rollTip === "CREATE") {
      _admRolls.push(_admRoll);
    } else if (localObj.newObj.rollTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admRolls[index] = _admRoll;
    } else if ((localObj.newObj.rollTip === "DELETE")) {
      _admRolls = admRolls.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRoll Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRoll ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.rollTip}`, life: 3000 });
    setAdmRolls(_admRolls);
    setAdmRoll(emptyAdmRoll);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admRolls.length; i++) {
      if (admRolls[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmRollDialog(emptyAdmRoll);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.name}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.name}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      valid: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    let value1 = e.target.value
    let _filters = { ...filters };

    _filters["global"].value = value1;

    setFilters(_filters);
    setGlobalFilterValue(value1);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1">
          <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label="Structures" icon="pi pi-building"  onClick={openNew} text raised disabled={!admRoll}/>
        </div>   
        <div className="flex flex-wrap gap-1">
          <Button label="Actions" icon="pi pi-shield"  onClick={openNew} text raised disabled={!admRoll}/>
        </div> 
        <div className="flex flex-wrap gap-1">
          <Button label="Links" icon="pi pi-sitemap"  onClick={openNew} text raised disabled={!admRoll}/>
        </div>         
        <div className="flex flex-wrap gap-1">
          <Button label="Users" icon="pi pi-users"  onClick={openNew} text raised disabled={!admRoll}/>
        </div>                      
        <div className="flex-grow-1" />
        <b>User group Lista</b>
        <div className="flex-grow-1"></div>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const validBodyTemplate = (rowData) => {
    const valid = rowData.valid == 1?true:false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };

  const validFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Valid
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };

  // <--- Dialog
  const setAdmRollDialog = (admRoll) => {
    setVisible(true)
    setRollTip("CREATE")
    setAdmRoll({ ...admRoll });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const rollTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmRollDialog(rowData)
            setRollTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={admRoll}
        loading={loading}
        value={admRolls}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setAdmRoll(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={rollTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />        
        <Column
          field="code"
          header="Code"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="name"
          header="Text"
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>
        <Column
          field="valid"
          filterField="valid"
          dataType="numeric"
          header="Valid"
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "15%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>
      </DataTable>
      <Dialog
        header="Roll"
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmAkcija
            parameter={"inputTextValue"}
            admRoll={admRoll}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            rollTip={rollTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
    </div>
  );
}
