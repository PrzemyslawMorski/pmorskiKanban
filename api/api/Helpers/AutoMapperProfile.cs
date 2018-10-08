using api.Data.Dtos.User;
using api.Data.Entities;
using AutoMapper;

namespace api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterDto, User>();
        }
    }
}