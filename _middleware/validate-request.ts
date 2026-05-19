export default validateRequest;
 
function validateRequest(
  req: any, next: any, schema: any
) {
  const options = {
    abortEarly: false,   // show all errors
    allowUnknown: true,  // ignore unknown fields
    stripUnknown: true   // remove unknown fields
  };
  const { error, value } = schema.validate(
    req.body, options
  );
  if (error) {
    next(`Validation error: ${
      error.details.map((x: any) => x.message).join(', ')
          }`);
  } else {
    req.body = value;
    next();
  }
}