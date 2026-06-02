import axios from "axios";

const API =
  "http://localhost:5000/api/email";


// GET HISTORY
export const getHistory =
  async () => {

    const token =
      localStorage.getItem("token");

    return axios.get(
      `${API}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

export const generateEmail =
  async (data) => {

    const token =
      localStorage.getItem("token");

    return axios.post(
      `${API}/generate`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  