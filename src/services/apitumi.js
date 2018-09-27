import request from '../utils/request';

export async function queryDelivery() {
  return request('tumi/delivery/list');
}

export async function submitDelivery(params) {
  return request('tumi/task/submit', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getDelivery(taskId) {
  return request('tumi/task/info', {
    method: 'POST',
    body: {
      taskId,
      "folderId": "0"
    }
  });
}

export async function queryReceive() {
  return request('tumi/accept/list');
}

export async function getReceive(taskId) {
  return request('tumi/task/info', {
    method: 'POST',
    body: {
      taskId,
      "folderId": "0"
    }
  });
}


export async function getVerification(params) {
  let url = "tumi/verify-code?phoneNumber=" + params;
  return request(url, {
    method: 'GET',
  });
}

export async function getConfigVerification(params) {
  let url = "tumi/user/password/verify-code?phoneNumber="+params;
  return request(url, {
    method: 'GET',
  });
}

export async function login(params) {
  return request('tumi/login', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function configPassword(params) {
  return request('tumi/user/password/setting', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function changePassword(params) {
  return request('tumi/user/password/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function personalCertification(params) {
  return request('tumi/user/name-verify', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function companyCertification(params) {
  return request('tumi/user/corp-verify', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getMainPage() {
  let url = "tumi/mainpage";
  return request(url, {
    method: 'GET',
  });
}

export async function copyrightList(params) {
  return request('tumi/copyright/list', {
    method: 'GET',
  });
}

export async function copyrightFile(params) {
  let url = "tumi/copyright/files?taskId=" + params;
  return request(url, {
    method: 'GET',
  });
}

export async function copyrightCount(params) {
  let url = "tumi/copyright/file/count";
  return request(url, {
    method: 'GET',
  });
}
