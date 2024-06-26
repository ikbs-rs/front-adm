import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmDbParameterService } from "../../service/model/AdmDbParameterService";
import DbParameter from './admDbParameter';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';


export default function AdmDbParameterL(props) {
  const objName = "adm_dbparameter"
  const emptyAdmDbParameter = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admDbParameters, setAdmDbParameters] = useState([]);
  const [admDbParameter, setAdmDbParameter] = useState(emptyAdmDbParameter);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [dbParameterTip, setDbParameterTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const admDbParameterService = new AdmDbParameterService();
        const data = await admDbParameterService.getAdmDbParameterV();
        setAdmDbParameters(data);
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

    let _admDbParameters = [...admDbParameters];
    let _admDbParameter = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.dbParameterTip === "CREATE") {
      _admDbParameters.push(_admDbParameter);
    } else if (localObj.newObj.dbParameterTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admDbParameters[index] = _admDbParameter;
    } else if ((localObj.newObj.dbParameterTip === "DELETE")) {
      _admDbParameters = admDbParameters.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmDbParameter Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmDbParameter ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.dbParameterTip}`, life: 3000 });
    setAdmDbParameters(_admDbParameters);
    setAdmDbParameter(emptyAdmDbParameter);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admDbParameters.length; i++) {
      if (admDbParameters[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmDbParameterDialog(emptyAdmDbParameter);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
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
      text: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      comment: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      version: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },      
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
        <div className="flex-grow-1"></div>
        <b>Db parametri List</b>
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

  // <--- Dialog
  const setAdmDbParameterDialog = (admDbParameter) => {
    setVisible(true)
    setDbParameterTip("CREATE")
    setAdmDbParameter({ ...admDbParameter });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const dbParameterTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmDbParameterDialog(rowData)
            setDbParameterTip("UPDATE")
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
        selection={admDbParameter}
        loading={loading}
        value={admDbParameters}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="660px"
        virtualScrollerOptions={{ itemSize: 55 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setAdmDbParameter(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={dbParameterTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />        
        <Column
          field="code"
          header="Code"
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="text"
          header="Text"
          sortable
          filter
          style={{ width: "50%" }}
        ></Column>
        <Column
          field="comment"
          header="Comment"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="version"
          header="Version"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>        
      </DataTable>
      <Dialog
        header="DbParameter"
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <DbParameter
            parameter={"inputTextValue"}
            admDbParameter={admDbParameter}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            dbParameterTip={dbParameterTip}
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
