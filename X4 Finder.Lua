local http = game:GetService("HttpService")
local players = game:GetService("Players")
local replicatedStorage = game:GetService("ReplicatedStorage")
local starterPlayer = game:GetService("StarterPlayer")
local workspace = game:GetService("Workspace")
local userInputService = game:GetService("UserInputService")

-- == Load Dex UI ==
local Dex = loadstring(game:HttpGetAsync("https://raw.githubusercontent.com/kavoo10/Dex/main/Source.lua"))()

-- == Configuration Storage ==
local config = {
    theme = "dark",
    minimized = false,
    autoRescan = true,
    scanInterval = 60,
    language = "en"
}

-- == Utility Functions ==
local function deepSearch(parent, filterTypes)
    local results = {}
    local queue = { parent }

    while #queue > 0 do
        local current = table.remove(queue)
        if current:IsA("Instance") then
            if table.find(filterTypes, current.ClassName) then
                table.insert(results, current)
            end
            for _, child in ipairs(current:GetChildren()) do
                table.insert(queue, child)
            end
        end
    end

    return results
end

local function getRemotePath(remote)
    local path = {}
    local obj = remote
    while obj.Parent and obj ~= game do
        table.insert(path, 1, obj.Name)
        obj = obj.Parent
    end
    return table.concat(path, ".")
end

local function formatTime(timestamp)
    local t = os.date("*t", timestamp)
    return string.format("%02d:%02d:%02d", t.hour, t.min, t.sec)
end

local function copyToClipboard(text)
    setclipboard(text)
    notify("Copied to Clipboard!", text, 3)
end

local function notify(title, message, duration)
    Dex.Notify(title, message, duration or 5)
end

-- == Main Window Setup ==
local window = Dex.NewWindow("X4 Finder v2", Vector2.new(900, 650), Enum.KeyCode.RightShift)

window:SetTheme(config.theme == "dark" and Dex.Themes.Dark or Dex.Themes.Light)
window.Minimizable = true
window.Draggable = true

-- == Tabs ==
local tabFinder = window:AddTab("Finder")
local tabSpyLog = window:AddTab("Spy Log")
local tabTest = window:AddTab("Test")
local tabSettings = window:AddTab("Settings")

-- == Finder Tab ==
local finderFrame = tabFinder:AddFrame()
local searchBox = finderFrame:AddInput("Search Remotes...", "Type here...")
local filterDropdown = finderFrame:AddDropdown("Filter Type", {"All", "RemoteEvent", "RemoteFunction"})
local filterKeyword = finderFrame:AddInput("Filter Keyword", "e.g. 'jump', 'money'")
local remoteList = finderFrame:AddScrollingFrame()
remoteList.CanvasSize = UDim2.new(0, 0, 0, 2000)

local detailFrame = finderFrame:AddFrame()
detailFrame.Size = UDim2.new(1, 0, 0, 200)
detailFrame.LayoutOrder = 999

local nameLabel = detailFrame:AddLabel("Name: ")
local typeLabel = detailFrame:AddLabel("Type: ")
local pathLabel = detailFrame:AddLabel("Path: ")
local usageLabel = detailFrame:AddLabel("Calls: ")
local explainLabel = detailFrame:AddLabel("Explanation: ")

local copyButton = detailFrame:AddButton("📋 Copy Path")
copyButton.Size = UDim2.new(0, 100, 0, 30)

local exportButton = finderFrame:AddButton("📤 Export to Clipboard")
exportButton.Size = UDim2.new(0, 150, 0, 30)

-- == Spy Log Tab ==
local spyLogFrame = tabSpyLog:AddFrame()
local spyLogArea = spyLogFrame:AddScrollingFrame()
spyLogArea.CanvasSize = UDim2.new(0, 0, 0, 2000)

-- == Test Tab ==
local testFrame = tabTest:AddFrame()
local testRemoteLabel = testFrame:AddLabel("Selected Remote:")
local testName = testFrame:AddLabel("None")
local testArgsInput = testFrame:AddInput("Enter Args (comma-separated)")
local testFireBtn = testFrame:AddButton("FireServer")
local testInvokeBtn = testFrame:AddButton("InvokeServer")

-- == Settings Tab ==
local settingsFrame = tabSettings:AddFrame()
local themeToggle = settingsFrame:AddToggle("Dark Mode", config.theme == "dark")
local minimizeToggle = settingsFrame:AddToggle("Start Minimized", config.minimized)
local autoRescanToggle = settingsFrame:AddToggle("Auto Rescan", config.autoRescan)
local intervalSlider = settingsFrame:AddSlider("Scan Interval (sec)", 10, 300, config.scanInterval)
local resetButton = settingsFrame:AddButton("Reset Preferences")
resetButton.Size = UDim2.new(0, 150, 0, 30)

-- == Data Storage ==
local remotes = {}
local callCount = {}
local spyLogs = {}

-- == Scan Remotes ==
local function scanRemotes()
    local types = {"RemoteEvent", "RemoteFunction"}
    local found = deepSearch(replicatedStorage, types)
    table.move(deepSearch(workspace, types), 1, #deepSearch(workspace, types), #found + 1, found)
    table.move(deepSearch(players, types), 1, #deepSearch(players, types), #found + 1, found)
    table.move(deepSearch(starterPlayer, types), 1, #deepSearch(starterPlayer, types), #found + 1, found)

    remotes = {}
    for _, remote in pairs(found) do
        if not callCount[remote] then
            callCount[remote] = 0
        end
        table.insert(remotes, remote)
    end

    updateRemoteList()
    notify("Scan Complete", string.format("Found %d remotes.", #remotes))
end

-- == Argument Analyzer ==
local function analyzeArguments(args)
    local result = ""
    for i, arg in ipairs(args) do
        if typeof(arg) == "Instance" then
            result = result .. string.format("Arg%d: %s (%s)\n", i, arg.Name, arg.ClassName)
        else
            result = result .. string.format("Arg%d: %s\n", i, tostring(arg))
        end
    end
    return result
end

-- == Auto Explain Remote ==
local explanations = {
    ["jump"] = "Handles jumping mechanics.",
    ["fire"] = "Used for shooting or triggering effects.",
    ["buy"] = "Related to purchasing items or upgrades.",
    ["teleport"] = "Teleports the player or object.",
    ["damage"] = "Applies damage to entities.",
    ["chat"] = "Controls chat-related functions.",
    ["load"] = "Loads assets or levels.",
    ["save"] = "Saves data such as inventory or progress.",
    ["open"] = "Opens GUIs, doors, or menus.",
    ["close"] = "Closes GUIs, doors, or menus.",
}

local function autoExplainRemote(remote)
    for key, value in pairs(explanations) do
        if string.find(string.lower(remote.Name), key, nil, true) then
            return value
        end
    end
    return "No explanation available."
end

-- == Hook Remote Calls ==
spawn(function()
    while wait(0.1) do
        for _, remote in pairs(remotes) do
            if not remote.Destroyed then
                local oldFireServer = remote.FireServer
                local oldInvokeServer = remote.InvokeServer

                remote.FireServer = function(self, ...)
                    local args = {...}
                    callCount[remote] = (callCount[remote] or 0) + 1
                    local logEntry = string.format("[%s] Fired '%s' with %d arguments\n%s", formatTime(os.time()), remote.Name, #args, analyzeArguments(args))
                    table.insert(spyLogs, logEntry)
                    updateSpyLog()
                    return oldFireServer(self, ...)
                end

                remote.InvokeServer = function(self, ...)
                    local args = {...}
                    callCount[remote] = (callCount[remote] or 0) + 1
                    local logEntry = string.format("[%s] Invoked '%s' with %d arguments\n%s", formatTime(os.time()), remote.Name, #args, analyzeArguments(args))
                    table.insert(spyLogs, logEntry)
                    updateSpyLog()
                    return oldInvokeServer(self, ...)
                end
            end
        end
    end
end)

-- == Export Button ==
exportButton.OnClick = function()
    local output = "Index,Name,Type,Path,Calls,Explanation\n"
    for i, remote in ipairs(remotes) do
        output = output .. string.format("%d,\"%s\",\"%s\",\"%s\",%d,\"%s\"\n", i, remote.Name, remote.ClassName, getRemotePath(remote), callCount[remote], autoExplainRemote(remote))
    end
    copyToClipboard(output)
    notify("Exported", "Remote list exported to clipboard as CSV.")
end

-- == Theme Toggle ==
themeToggle.OnChanged = function(value)
    config.theme = value and "dark" or "light"
    window:SetTheme(value and Dex.Themes.Dark or Dex.Themes.Light)
end

minimizeToggle.OnChanged = function(value)
    config.minimized = value
    window.Minimized = value
end

autoRescanToggle.OnChanged = function(value)
    config.autoRescan = value
end

intervalSlider.OnChanged = function(value)
    config.scanInterval = value
end

resetButton.OnClick = function()
    config = {
        theme = "dark",
        minimized = false,
        autoRescan = true,
        scanInterval = 60
    }
    themeToggle:SetValue(true)
    minimizeToggle:SetValue(false)
    autoRescanToggle:SetValue(true)
    intervalSlider:SetValue(60)
    window.Minimized = false
    window:SetTheme(Dex.Themes.Dark)
    notify("Preferences Reset", "Default settings restored.")
end

-- == Search Box ==
searchBox.OnChanged = function(text)
    updateRemoteList()
end

filterDropdown.OnChanged = function()
    updateRemoteList()
end

filterKeyword.OnChanged = function()
    updateRemoteList()
end

-- == Update List ==
local selectedRemote = nil

local function updateRemoteList()
    remoteList:Clear()

    local keyword = string.lower(filterKeyword.Text)
    local filterType = filterDropdown.Value

    for _, remote in ipairs(remotes) do
        local name = string.lower(remote.Name)
        local matchesKeyword = string.find(name, keyword, 1, true)
        local matchesType = filterType == "All" or remote.ClassName == filterType

        if matchesKeyword and matchesType then
            local btn = remoteList:AddButton(remote.Name)
            btn.MouseButton1Click:Connect(function()
                selectedRemote = remote
                testName.Text = remote.Name
                nameLabel.Text = "Name: " .. remote.Name
                typeLabel.Text = "Type: " .. remote.ClassName
                pathLabel.Text = "Path: " .. getRemotePath(remote)
                usageLabel.Text = "Calls: " .. (callCount[remote] or 0)
                explainLabel.Text = "Explanation: " .. autoExplainRemote(remote)

                copyButton.OnClick = function()
                    copyToClipboard(pathLabel.Text:sub(6)) -- Remove "Path: "
                end
            end)
        end
    end
end

-- == Test Tab Logic ==
testFireBtn.OnClick = function()
    if selectedRemote and selectedRemote.ClassName == "RemoteEvent" then
        local args = {}
        for s in string.gmatch(testArgsInput.Text, "[^,]+") do
            table.insert(args, tonumber(s) or s:trim())
        end
        selectedRemote:FireServer(unpack(args))
        notify("Fired", string.format("Fired %s with %d arguments", selectedRemote.Name, #args))
    end
end

testInvokeBtn.OnClick = function()
    if selectedRemote and selectedRemote.ClassName == "RemoteFunction" then
        local args = {}
        for s in string.gmatch(testArgsInput.Text, "[^,]+") do
            table.insert(args, tonumber(s) or s:trim())
        end
        local result = selectedRemote:InvokeServer(unpack(args))
        notify("Invoked", string.format("Result: %s", tostring(result)))
    end
end

-- == Live Updates ==
spawn(function()
    while wait(config.scanInterval) do
        if config.autoRescan then
            scanRemotes()
        end
    end
end)

-- == Initial Load ==
scanRemotes()
notify("X4 Finder v2 Loaded", "Press Right Shift to show/hide the GUI.")