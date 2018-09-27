// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  var jsonStr = localStorage.getItem('antd-pro-authority') || '{}';
  return JSON.parse(jsonStr);
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', JSON.stringify(authority));
}

export function goToManage(){
  var a = getAuthority();
  if(a && a.userId){
     location.href = "../manage/index.html";
  }else{
    //location.href = "../";
  }
}
