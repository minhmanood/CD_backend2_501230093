export function removeVietnameseAccents(str){
    return str
     .normalize('NFD')
     .replace(/[\u0300-\u036F]/g,'')
     .replace(/đ/g,'d')
     .replace(/Đ/g,'D')
}