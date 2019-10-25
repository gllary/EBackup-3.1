import axios from 'axios';

const sendServerConfig = (url, data) =>
  axios.request({
    method: 'post',
    url: `http://${url}/api/v1/inspection/ebackup-config`,
    data,
    headers: { 'Content-Type': 'application/json' }
  });

const fetchInspectRecords = url =>
  axios.request({
    method: 'get',
    url: `http://${url}/api/v1/inspection/home/count?type=ebackup`,
  });

export {
  sendServerConfig,
  fetchInspectRecords
};
