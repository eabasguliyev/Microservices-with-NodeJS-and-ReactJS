$folders = Get-ChildItem -Recurse -Directory -Depth 1

$folder_name = "node_modules"

Foreach ($item in $folders) {
 Set-Location $item
 if(Test-Path $folder_name){
	 Remove_item $folder_name -Force -Recurse
	 echo '$folder_name deleted'
 }
 cd ..
}