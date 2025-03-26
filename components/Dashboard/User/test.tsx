import axiosConfig from "@/api/api";
import axios from "axios";

const Test = () => {
    
    const data = fetch("https://tiju.krestdev.com/api/users")
    .then(res => res.json()) // Assuming the response is JSON, you can handle the response data here
    .then(data => {
    console.log(data); // Log the fetched data
    return data; // Return the data so it can be used by other parts of the app
    })
    .catch(err => {
    console.log("Error fetching data:", err); // Log any errors
    });

    const fetchData = () => {
      axios.get("https://tiju.krestdev.com/api/users", {
        headers: {
          Authorization: `Bearer abc123`, // Correction de "Baerer" -> "Bearer"
          // "x-api-key": "abc123",
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log(response.data); // Log the fetched data
        return response.data; // Return the data so it can be used by other parts of the app
      })
      .catch(err => {
        console.log("Error fetching data:", err); // Log any errors
      });
    };
    
    const data2 = fetchData();

    return {data,data2}
}

export default Test;

