import { SystemTemplate } from '../types';
import { quantumInvestBlueprint } from './blueprints/quantumInvest';
import { nexusHealthBlueprint } from './blueprints/nexusHealth';
import { logiCoreBlueprint } from './blueprints/logiCore';

export const ALL_BLUEPRINTS: SystemTemplate[] = [
    quantumInvestBlueprint,
    nexusHealthBlueprint,
    logiCoreBlueprint,
];