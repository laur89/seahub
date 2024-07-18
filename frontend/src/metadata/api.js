import axios from 'axios';
import cookie from 'react-cookies';
import { siteRoot } from '../utils/constants';

class MetadataManagerAPI {
  init({ server, username, password, token }) {
    this.server = server;
    this.username = username;
    this.password = password;
    this.token = token; // none
    if (this.token && this.server) {
      this.req = axios.create({
        baseURL: this.server,
        headers: { 'Authorization': 'Token ' + this.token },
      });
    }
    return this;
  }

  initForSeahubUsage({ siteRoot, xcsrfHeaders }) {
    if (siteRoot && siteRoot.charAt(siteRoot.length - 1) === '/') {
      var server = siteRoot.substring(0, siteRoot.length - 1);
      this.server = server;
    } else {
      this.server = siteRoot;
    }

    this.req = axios.create({
      headers: {
        'X-CSRFToken': xcsrfHeaders,
      }
    });
    return this;
  }

  _sendPostRequest(url, form) {
    if (form.getHeaders) {
      return this.req.post(url, form, {
        headers: form.getHeaders()
      });
    } else {
      return this.req.post(url, form);
    }
  }

  getCollaborators = (repoID) => {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/related-users/';
    return this.req.get(url);
  };

  getMetadataStatus(repoID) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/';
    return this.req.get(url);
  }

  createMetadata(repoID) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/';
    return this.req.put(url);
  }

  deleteMetadata(repoID) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/';
    return this.req.delete(url);
  }

  getMetadata(repoID, params) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/records/';
    return this.req.get(url, { params: params });
  }

  insertColumn = (repoID, name, type, { key, data }) => {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/columns/';
    let params = {
      'column_name': name,
      'column_type': type,
    };
    if (key) {
      params['column_key'] = key;
    }

    if (data) {
      params['column_data'] = data;
    }
    return this.req.post(url, params);
  };

  getMetadataRecordInfo(repoID, parentDir, name) {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/record/';
    let params = {};
    if (parentDir) {
      params['parent_dir'] = parentDir;
    }
    if (name) {
      params['name'] = name;
    }
    return this.req.get(url, { params: params });
  }

  modifyRecord = (repoID, recordID, update) => {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/records/';
    const data = { records_data: [{ record_id: recordID, record: update }] };
    return this.req.put(url, data);
  };

  modifyRecords = (repoID, recordsData, is_copy_paste = false) => {
    const url = this.server + '/api/v2.1/repos/' + repoID + '/metadata/records/';
    let data = { records_data: recordsData };
    if (is_copy_paste) {
      data.is_copy_paste = 'true';
    }
    return this.req.put(url, data);
  };

  listUserInfo = (userIds) => {
    const url = this.server + '/api/v2.1/user-list/';
    const params = { user_id_list: userIds };
    return this._sendPostRequest(url, params, { headers: { 'Content-type': 'application/json' } });
  };

}

const metadataAPI = new MetadataManagerAPI();
const xcsrfHeaders = cookie.load('sfcsrftoken');
metadataAPI.initForSeahubUsage({ siteRoot, xcsrfHeaders });

export default metadataAPI;
