import User from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class PrivateFile{
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public key: string;

    @ManyToOne(() => User, (owner: User) => owner.files)
    public owner: User;
}

export default PrivateFile;