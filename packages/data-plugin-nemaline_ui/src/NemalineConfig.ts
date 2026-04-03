import { ResourceViewConfig } from 'linked-data-browser';
import { Stethoscope } from 'lucide-react-native';
import { NemalineView } from './NemalineView';
import { PersonShapeType } from '@oxfordia/data-plugin-nemaline_core';

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const GIST_PERSON = 'https://w3id.org/semanticarts/ns/ontology/gist/Person';

export const NemalineConfig: ResourceViewConfig = {
  name: 'nemaline',
  displayName: 'Nemaline Assessments',
  displayIcon: Stethoscope,
  view: NemalineView,
  canDisplay: (_targetUri, targetResource, dataset) => {
    if (targetResource?.type !== 'SolidLeaf') return false;
    if (!targetResource.isDataResource?.()) return false;
    const persons = dataset
      .usingType(PersonShapeType)
      .matchSubject(RDF_TYPE, GIST_PERSON, targetResource.uri);
    const count = persons?.size ?? 0;
    return count > 0;
  },
};
