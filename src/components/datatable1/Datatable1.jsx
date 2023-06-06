import "./datatable1.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumnss} from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, child,get,getDatabase,remove} from "firebase/database";


const Datatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `drivers/`));
      if (snapshot.exists()) {

        snapshot.forEach((childSnapshot) => {
          list.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setData(list);
      }
    };
    fetchData();
  },[]);

  console.log(data);

  const handleDelete = async (id) => {
   try{
     // Remove user from Firebase database
     const dbRef = ref(getDatabase());
     await remove(child(dbRef, `drivers/${id}`));
   
     // Remove user from state
     setData(data.filter((item) => item.id !== id));
   }catch(err){
    console.log(err);
   }
  };
  

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
             
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Driver
        <Link to="/drivers/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumnss.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
