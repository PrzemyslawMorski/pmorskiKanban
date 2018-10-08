# Build stage
FROM microsoft/aspnetcore-build:2 AS build-env

WORKDIR /api

# restore
COPY api/api.csproj ./api/
RUN dotnet restore api/api.csproj
COPY unit/unit.csproj ./unit/
RUN dotnet restore unit/unit.csproj

# copy src
COPY . .

# test
RUN dotnet test unit/unit.csproj

# publish
RUN dotnet publish api/api.csproj -o /publish

# Runtime stage
FROM microsoft/aspnetcore:2
COPY --from=build-env /publish /publish
WORKDIR /publish
ENTRYPOINT ["dotnet", "api.dll"]
