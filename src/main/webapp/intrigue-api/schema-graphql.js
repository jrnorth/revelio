module.exports = `
enum Direction {
  # Smaller to Larger values
  asc
  # Smaller to Larger values
  ascending
  # Larger to Smaller values
  desc
  # Larger to Smaller values
  descending
}

input QuerySortInput {
  attribute: String
  direction: Direction
}

type QuerySort {
  attribute: String
  direction: Direction
}

input QuerySettingsInput {
  src: String
  federation: String
  phonetics: Boolean
  sorts: [QuerySortInput]
  spellcheck: Boolean

  # Page size
  count: Int

  # Start of paging. First element is 1, not 0.
  start: Int
  type: String
}

type QuerySettings {
  src: [String]
  federation: String
  phonetics: Boolean
  sorts: [QuerySort]
  spellcheck: Boolean
  detail_level: String
  type: String
}

input QueryRequest {
  filterTree: Json
}

type QueryResponseStatus {
  count: Int
  elapsed: Int
  hits: Int
  id: ID
  successful: Boolean
}

type MetacardAction {
  description: String
  displayName: String
  id: ID
  title: String
  url: String
}

type QueryResponseResult {
  actions: [MetacardAction]
  # All known metacard attributes with raw attributes names.
  # This is intended for views that are interested in:
  # 1. Using raw attribute names.
  # 2. Attribute aliasing that require raw attribute names.
  # 3. Getting all the possible attributes.
  metacard: Json
}

type QueryResponse {
  results: [QueryResponseResult]
  attributes: [MetacardAttributes]
  status: QueryResponseStatus
}

type ImageryProvider {
  id: ID
  alpha: Int
  label: String
  name: String
  order: Int
  parameters: Json
  proxyEnabled: Boolean
  show: Boolean
  type: String
  url: String
}

type TerrainProvider {
  type: String
  url: String
}

# Admin configured system properties
type SystemProperties {
  attributeAliases: Json
  attributeDescriptions: Json
  attributeSuggestionList: [String]
  basicSearchMatchType: String
  basicSearchTemporalSelectionDefault: [String]
  bingKey: String
  branding: String
  customBackgroundAccentContent: String
  customBackgroundContent: String
  customBackgroundDropdown: String
  customBackgroundModal: String
  customBackgroundNavigation: String
  customBackgroundSlideout: String
  customFavoriteColor: String
  customNegativeColor: String
  customPositiveColor: String
  customPrimaryColor: String
  customWarningColor: String
  defaultLayout: [Json]
  disableLocalCatalog: Boolean
  disableUnknownErrorBox: Boolean
  editorAttributes: [String]
  enums: Json
  exportResultLimit: Int
  externalAuthentication: Boolean
  gazetteer: Boolean
  hiddenAttributes: [String]
  i18n: Json
  imageryProviders: [ImageryProvider]
  isArchiveSearchDisabled: Boolean
  isCacheDisabled: Boolean
  isEditingAllowed: Boolean
  isExperimental: Boolean
  isHistoricalSearchDisabled: Boolean
  isMetacardPreviewDisabled: Boolean
  isPhoneticsEnabled: Boolean
  isSpellcheckEnabled: Boolean
  isVersioningEnabled: Boolean
  listTemplates: [String]
  mapHome: String
  onlineGazetteer: Boolean
  product: String
  projection: String
  queryFeedbackEmailBodyTemplate: String
  queryFeedbackEmailSubjectTemplate: String
  queryFeedbackEnabled: Boolean
  readOnly: [String]
  relevancePrecision: Int
  requiredAttributes: [String]
  resultCount: Int
  resultShow: [String]
  scheduleFrequencyList: [Int]
  showIngest: Boolean
  showLogo: Boolean
  showRelevanceScores: Boolean
  showTask: Boolean
  showWelcome: Boolean
  sourcePollInterval: Int
  spacingMode: String
  summaryShow: [String]
  terrainProvider: TerrainProvider
  theme: String
  timeout: Int
  typeNameMapping: Json
  useHyphensInUuid: Boolean
  version: String
  webSocketsEnabled: Boolean
  zoomPercentage: Int

  background: String
  color: String
  favIcon: String
  footer: String
  header: String
  productImage: String
  title: String
  vendorImage: String

  commitHash: String
  isDirty: String
  commitDate: String
  identifier: String
  releaseDate: String
}

type Source {
  isAvailable: Boolean
  # #### Determines if this source is the local catalog.
  local: Boolean
  catalogedTypes: [String]
  sourceId: ID
  actions: [String]
  version: String
}

type DateTimeFormatPreference {
  datetimefmt: String
  timefmt: String
}

type BlacklistResult {
  id: String
  title: String
}

type ThemePreferences {
  customBackgroundAccentContent: String
  customBackgroundContent: String
  customBackgroundDropdown: String
  customBackgroundModal: String
  customBackgroundNavigation: String
  customBackgroundSlideout: String
  customFavoriteColor: String
  customNegativeColor: String
  customPositiveColor: String
  customPrimaryColor: String
  customWarningColor: String
  spacingMode: String
  theme: String
}

type UserPreferences {
  alertExpiration: Float
  alertPersistence: Boolean
  alerts: [String]
  animation: Boolean
  columnHide: [String]
  columnOrder: [String]
  coordinateFormat: String
  dateTimeFormat: DateTimeFormatPreference
  fontSize: Float
  goldenLayout: Json
  homeDisplay: String
  homeFilter: String
  homeSort: String
  hoverPreview: Boolean
  id: ID
  inspectorDetailsHidden: [String]
  inspectorDetailsOrder: [String]
  inspectorSummaryOrder: [String]
  inspectorSummaryShown: [String]
  mapLayers: [ImageryProvider]
  querySettings: QuerySettings
  resultBlacklist: [BlacklistResult]
  resultCount: Int
  resultDisplay: String
  resultPreview: [String]
  theme: ThemePreferences
  timeZone: String
  uploads: [Json]
  visualization: String
}

# Current logged in user
type User {
  email: String
  isGuest: Boolean
  preferences: UserPreferences
  roles: [String]
  userid: String
  username: String
}

# Registered metacard attribute type
type MetacardType {
  id: ID
  isInjected: Boolean
  multivalued: Boolean
  type: String
  enums: [String]
}

type FacetResult {
  count: Int
  value: String
}

type Suggestion {
  id: ID!
  name: String!
}

type GeoJSON {
  type: String!
  geometry: Json!
  properties: Json!
  id: String!
}

type Query {
  user: User
  sources: [Source]
  systemProperties: SystemProperties
  metacardTypes: [MetacardType]

  # #### Query the Catalog Framework for Metcards.
  #
  # Below is an example filterTree to query for all resource Metacards:
  # If no metacard tag is specified in the filterTree, **only resource metacards** will be returned.
  metacards(filterTree: Json!, settings: QuerySettingsInput): QueryResponse

  metacardsByTag(tag: String!, settings: QuerySettingsInput): QueryResponse
  metacardById(id: ID!, settings: QuerySettingsInput): QueryResponse

  # Get known values for a given attribute.
  #
  # NOTE: attributes need to be **whitelisted by an Admin** before they can be faceted
  facet(attribute: String!): [FacetResult]

  suggestions(q: String!): [Suggestion]
  geofeature(id: String!): GeoJSON
}

type MutationResponse {
  metacard: Json
  attributes: [MetacardAttributes]
}

type Mutation {
  createMetacard(attrs: MetacardAttributesInput!): MetacardAttributes
  saveMetacard(id: ID!, attrs: MetacardAttributesInput!): MetacardAttributes

  # TBD: Should only be used when...
  # createMetacardFromJson(attrs: Json!): MetacardAttributes
  # saveMetacardFromJson(id: ID!, attrs: Json!): MetacardAttributes

  deleteMetacard(id: ID!): ID
  updateUserPreferences(userPreferences: Json): Json
}
`
