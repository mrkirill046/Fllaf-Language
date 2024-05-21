#define MyAppName "Fllaf"
#define MyAppVersion "1.1"
#define MyAppPublisher "QWY_Games"
#define MyAppExeName "fllaf-language.exe"
#define MyAppAssocName MyAppName + " File"
#define MyAppAssocExt ".fllaf"
#define MyAppAssocKey StringChange(MyAppAssocName, " ", "") + MyAppAssocExt

[Setup]
AppId={{5215AA4D-55D5-487C-830A-4FFB62F1014F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\Fllaf Language
ChangesAssociations=yes
DisableProgramGroupPage=yes
PrivilegesRequired=admin
OutputDir=C:\fllaf-language\build
OutputBaseFilename=Fllaf Language Setup
SetupIconFile=C:\fllaf-language\src\source\Fllaf-Icon-Round.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "addtopath"; Description: "Add Fllaf to the system PATH"; GroupDescription: "Additional tasks"; Flags: unchecked

[Files]
Source: "C:\fllaf-language\inno-setup\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\fllaf-language\inno-setup\fllaf.cmd"; DestDir: "{app}"; Flags: ignoreversion

[Registry]
Root: HKCU; Subkey: "Environment"; ValueType: string; ValueName: "Path"; \
    ValueData: "{olddata};{app}"; Flags: preservestringtype uninsdeletevalue

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
var
  Shell: Variant;
  LinkPath: String;
begin
  Shell := CreateOleObject('WScript.Shell');
  LinkPath := ExpandConstant('{win}\fllaf-language.exe');
  Result := True;
end;

function InitializeUninstall(): Boolean;
var
  Shell: Variant;
  LinkPath: String;
begin
  Shell := CreateOleObject('WScript.Shell');
  LinkPath := ExpandConstant('{win}\fllaf-language.exe');
  DeleteFile(LinkPath);
  Result := True;
end;