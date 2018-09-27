import request from '../utils/request';

export async function queryDelivery() {
  return request('/api/delivery/list');
}

export async function submitDelivery(params) {
  return request('/api/task/submit', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getDelivery(taskId) {
  return request('/api/task/info', {
    method: 'POST',
    body: {
      taskId,
      "folderId": "0"
    }
  });
}

export async function queryReceive() {
  return request('/api/recept/list');
}

export async function getReceive(taskId) {
  return request('/api/task/info', {
    method: 'POST',
    body: {
      taskId,
      "folderId": "0"
    }
  });
}


export async function getVerification(params) {
  let url = "/api/verify-code?phoneNumber=" + params;
  return request(url, {
    method: 'GET',
  });
}

export async function login(params) {
  return request('/api/login', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function configPassword(params) {
  return request('/api/user/password/setting', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function changePassword(params) {
  return request('/api/user/password/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function personalCertification(params) {
  return request('/api/user/name-verify', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function companyCertification(params) {
  return request('/api/user/corp-verify', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getMainPage() {
  let url = "/api/mainpage";
  return request(url, {
    method: 'GET',
  });
}

export async function copyrightList(params) {
  return request('/api/copyright/list', {
    method: 'GET',
  });
}

export async function copyrightFile(params) {
  return request('/api/copyright/files', {
    method: 'GET',
  });
}
