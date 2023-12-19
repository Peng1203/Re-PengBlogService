/** typeORM 迁移文件
 *  执行迁移操作 需要安装以下依赖
 *  pnpm install @nestjs/cli typeorm ts-node -g
 */
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '114514admin',
  database: 'blog_db',
  /** 加载项目中的 entities */
  entities: ['./src/common/entities/*.entity.{j,t}s'],
  /** 用于执行生成的迁移文件 */
  migrations: [`./src/migration/*.{j,t}s`],
  synchronize: false,
});

export default AppDataSource;
