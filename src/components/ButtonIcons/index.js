import { BiEditAlt } from 'react-icons/bi';
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from 'react-icons/fc';
import { FiTrash2, FiPlus } from 'react-icons/fi';

export function EditButtonIcon() {
  //return <FiEdit size={17}/>;
  return <BiEditAlt size={17}/>;
}

export function DeleteButtonIcon() {
  return <FiTrash2 size={17}/>;
  //return <FiDelete size={17}/>;
}

export function IncludeButtonIcon() {
  return <FiPlus size={17}/>;
}

export function SortAscButtonIcon() {
  return <FcAlphabeticalSortingAz size={17}/>;
}

export function SortDescButtonIcon() {
  return <FcAlphabeticalSortingZa size={17}/>;
}