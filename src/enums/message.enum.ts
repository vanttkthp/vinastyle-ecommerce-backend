export enum message {
  ID_NOT_FOUND = 'ID not found!',
  NOT_FOUND = 'Nothing found!',
  OK = 'Success!',
  FAILED = `Action can't execute!`,
}

export function foundAllMessage(count: number, name: string) {
  return `${count} ${name}${count === 1 ? '' : 's'} found`;
}

export function foundOneMessage(name: string) {
  return `A ${name} found!`;
}

export function SuccessMessage(modelName: string, action: string) {
  return `${action} ${modelName} successfully!`;
}

export function IdNotFoundMessage(name: string) {
  return `No ${name} with this id!`;
}
