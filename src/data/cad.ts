/**
 * CAD Lab feature flags + catalog live here so the main portfolio
 * stays clean until real STL/GLB exports are ready.
 */
export { cadModels, type CadModel, type CadModelFormat } from "./models";

/** When true, CAD Lab appears on the home page. */
export const showCadOnHome = true;

/** Dedicated route for the CAD Lab (always available; just unlinked for now). */
export const cadLabPath = "/cad";
