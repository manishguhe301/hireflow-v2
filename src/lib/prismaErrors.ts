export const PRISMA_ERRORS = {
  P2002: 'This value must be unique (already exists).', // e.g., email already used
  P2003: 'You’re linking to something that doesn’t exist.', // invalid foreign key
  P2000: 'The value is too long — please shorten it.', // exceeded allowed length
  P2025: 'The item you’re trying to update/delete was not found.', // record missing
  P2001: 'No record found with this value.', // findUnique not found
  P2014: 'This change breaks a relation between records.', // relation mismatch
};


