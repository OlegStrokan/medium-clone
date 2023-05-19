using System.ComponentModel.DataAnnotations;

namespace token.Models;


public class Token
{
    [Key]
    [Required]
    public string Id { get; set; }
    
    [Required]
    public string Value { get; set; }
    
    [Required]
    public string UserId { get; set; }
    
}