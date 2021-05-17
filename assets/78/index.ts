class EnvironmentRecord {
  OuterEnv: EnvironmentRecord | null;

}
class FunctionEnvironmentRecord extends EnvironmentRecord {
  OuterEnv: EnvironmentRecord;

}